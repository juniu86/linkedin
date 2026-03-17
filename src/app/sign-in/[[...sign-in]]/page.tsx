import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-[#111] border border-[#1a1a1a] shadow-none",
            headerTitle: "text-white",
            headerSubtitle: "text-[#888]",
            formButtonPrimary: "bg-[#d4af37] text-black hover:bg-[#c4a030]",
            formFieldInput: "bg-[#1a1a1a] border-[#333] text-white",
            formFieldLabel: "text-[#888]",
            identityPreviewEditButton: "text-[#d4af37]",
            footerActionLink: "text-[#d4af37]",
          },
        }}
      />
    </div>
  );
}
