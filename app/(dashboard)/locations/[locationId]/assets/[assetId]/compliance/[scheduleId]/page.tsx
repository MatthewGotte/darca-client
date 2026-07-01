"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  DatePicker,
  Descriptions,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Skeleton,
  Space,
  Switch,
  Tag,
  message,
} from "antd";
import dayjs from "dayjs";

import PageHeader from "@/components/page-header";
import Can from "@/components/can";
import ConfirmDelete from "@/components/confirm-delete";
import RequirePermission from "@/components/require-permission";

import {
  useAssetComplianceSchedule,
  useUpdateAssetComplianceSchedule,
  useDeleteAssetComplianceSchedule,
} from "@/hooks/data/use-compliance-schedules";
import { useAsset } from "@/hooks/data/use-assets";
import { useOrganisationLocation } from "@/hooks/data/use-locations";
import { useOrgId } from "@/hooks/use-org-id";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { UpdateComplianceScheduleRequest } from "@/lib/api/types";

export default function ComplianceScheduleDetailPage() {
  const { locationId, assetId, scheduleId } = useParams<{
    locationId: string;
    assetId: string;
    scheduleId: string;
  }>();
  const orgId = useOrgId();
  const router = useRouter();

  const { data: schedule, isLoading } = useAssetComplianceSchedule(
    assetId,
    scheduleId
  );
  const { data: asset } = useAsset(locationId, assetId);
  const { data: location } = useOrganisationLocation(orgId, locationId);

  const { trigger: updateSchedule, isMutating: updating } =
    useUpdateAssetComplianceSchedule(assetId, scheduleId);
  const { trigger: deleteSchedule, isMutating: deleting } =
    useDeleteAssetComplianceSchedule(assetId, scheduleId);

  const [editOpen, setEditOpen] = useState(false);
  const [decommissionOpen, setDecommissionOpen] = useState(false);
  const [form] = Form.useForm<UpdateComplianceScheduleRequest>();

  const handleEdit = async () => {
    const values = await form.validateFields();
    try {
      await updateSchedule({
        ...values,
        nextDueDate: values.nextDueDate
          ? dayjs(values.nextDueDate as unknown as string).toISOString()
          : undefined,
      });
      message.success("Schedule updated");
      setEditOpen(false);
    } catch {
      message.error("Failed to update schedule");
    }
  };

  const handleDecommission = async () => {
    try {
      await deleteSchedule();
      message.success("Schedule decommissioned");
      router.push(`/locations/${locationId}/assets/${assetId}?tab=compliance`);
    } catch {
      message.error("Failed to decommission schedule");
    }
  };

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!schedule) {
    return null;
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    {
      label: location?.name ?? locationId,
      href: `/locations/${locationId}`,
    },
    {
      label: asset?.name ?? assetId,
      href: `/locations/${locationId}/assets/${assetId}`,
    },
    { label: "Compliance" },
    { label: schedule.title },
  ];

  return (
    <RequirePermission permission={PERMISSIONS.COMPLIANCE_SCHEDULE_READ}>
      <div>
        <PageHeader
          title={schedule.title}
          breadcrumbs={breadcrumbs}
          actions={
            <Space>
              <Can permission={PERMISSIONS.COMPLIANCE_SCHEDULE_UPDATE}>
                <Button
                  onClick={() => {
                    form.setFieldsValue({
                      ...schedule,
                      nextDueDate: schedule.nextDueDate
                        ? (dayjs(schedule.nextDueDate) as unknown as string)
                        : undefined,
                    });
                    setEditOpen(true);
                  }}
                >
                  Edit
                </Button>
              </Can>
              {!schedule.decommissionedAt && (
                <Can permission={PERMISSIONS.COMPLIANCE_SCHEDULE_DECOMMISSION}>
                  <Button
                    danger
                    onClick={() => setDecommissionOpen(true)}
                  >
                    Decommission
                  </Button>
                </Can>
              )}
            </Space>
          }
        />

        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Title">{schedule.title}</Descriptions.Item>
          <Descriptions.Item label="Description">
            {schedule.description ?? "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Frequency">
            {schedule.frequencyInterval} {schedule.frequencyUnit}
          </Descriptions.Item>
          <Descriptions.Item label="Next Due Date">
            {schedule.nextDueDate
              ? dayjs(schedule.nextDueDate).format("YYYY-MM-DD")
              : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Last Triggered">
            {schedule.lastTriggeredAt
              ? dayjs(schedule.lastTriggeredAt).format("YYYY-MM-DD HH:mm")
              : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Active">
            <Tag color={schedule.active ? "green" : "default"}>
              {schedule.active ? "Active" : "Inactive"}
            </Tag>
          </Descriptions.Item>
          {schedule.decommissionedAt && (
            <Descriptions.Item label="Decommissioned At">
              {dayjs(schedule.decommissionedAt).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
          )}
        </Descriptions>

        {/* Edit Drawer */}
        <Drawer
          title="Edit Compliance Schedule"
          open={editOpen}
          onClose={() => setEditOpen(false)}
          width={480}
          destroyOnHide
          footer={
            <Space>
              <Button onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="primary" loading={updating} onClick={handleEdit}>
                Save
              </Button>
            </Space>
          }
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item
              name="frequencyInterval"
              label="Frequency Interval"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="frequencyUnit"
              label="Frequency Unit"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                options={[
                  { label: "Hours", value: "HOURS" },
                  { label: "Days", value: "DAYS" },
                  { label: "Weeks", value: "WEEKS" },
                  { label: "Months", value: "MONTHS" },
                  { label: "Years", value: "YEARS" },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="nextDueDate"
              label="Next Due Date"
              rules={[{ required: true, message: "Required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="active" label="Active" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Drawer>

        <ConfirmDelete
          open={decommissionOpen}
          onConfirm={handleDecommission}
          onCancel={() => setDecommissionOpen(false)}
          loading={deleting}
          title="Decommission Schedule"
          description="This will decommission the compliance schedule. This action cannot be undone."
        />
      </div>
    </RequirePermission>
  );
}
