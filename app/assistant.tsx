"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { useUser, SignIn } from "@clerk/nextjs";

export const Assistant = () => {
  const { isSignedIn, isLoaded } = useUser();
  
  const runtime = useChatRuntime({
    api: "/api/chat",
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col h-screen">
          <AppHeader />
          {isLoaded && !isSignedIn ? (
            <div className="flex items-center justify-center flex-1">
              <SignIn fallbackRedirectUrl="/" routing="hash" />
            </div>
          ) : (
            <Thread />
          )}
        </SidebarInset>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};
