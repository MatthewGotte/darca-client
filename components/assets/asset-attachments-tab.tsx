"use client";

import { useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useSWR, { mutate } from "swr";
import ConfirmDialog from "@/components/common/confirm-dialog";
import LoadingState from "@/components/common/loading-state";
import {
  deleteAssetAttachment,
  listAssetAttachments,
  uploadAssetAttachment,
} from "@/lib/api/api";

export default function AssetAttachmentsTab({ assetId }: { assetId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading, error } = useSWR(["asset-attachments", assetId], () =>
    listAssetAttachments(assetId)
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      await uploadAssetAttachment(assetId, file);
      await mutate(["asset-attachments", assetId]);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    await deleteAssetAttachment(assetId, deleteId);
    await mutate(["asset-attachments", assetId]);
    setDeleteId(null);
  }

  if (isLoading) return <LoadingState />;
  if (error) return <Alert severity="error">Failed to load attachments</Alert>;

  return (
    <Box>
      {uploadError ? <Alert severity="error" sx={{ mb: 2 }}>{uploadError}</Alert> : null}
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        Upload file
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>File name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((attachment) => (
            <TableRow key={attachment.id}>
              <TableCell>
                {attachment.url ? (
                  <a href={attachment.url} target="_blank" rel="noreferrer">
                    {attachment.fileName}
                  </a>
                ) : (
                  attachment.fileName
                )}
              </TableCell>
              <TableCell>{attachment.fileType ?? "—"}</TableCell>
              <TableCell>
                <Button color="error" size="small" onClick={() => setDeleteId(attachment.id!)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete attachment"
        message="This will permanently delete the attachment."
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
