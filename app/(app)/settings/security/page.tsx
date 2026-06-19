import ComingSoonPanel from "@/components/settings/coming-soon-panel";

export default function SecuritySettingsPage() {
  return (
    <ComingSoonPanel
      title="Security"
      description="Manage password, sign-in methods, and account security."
      bullets={[
        "Change password",
        "Multi-factor authentication",
        "Active sessions and devices",
        "Email verification workflows",
      ]}
    />
  );
}
