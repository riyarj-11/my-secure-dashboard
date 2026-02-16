import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Save } from "lucide-react";

export default function ProfileSection() {
  const { user } = useAuth();
  const { profile, update } = useProfile();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const { toast } = useToast();

  const startEdit = () => {
    setName(profile?.full_name ?? "");
    setEditing(true);
  };

  const save = async () => {
    update.mutate({ full_name: name.trim() }, {
      onSuccess: () => {
        setEditing(false);
        toast({ title: "Profile updated" });
      },
      onError: () => toast({ title: "Failed to update", variant: "destructive" }),
    });
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <User className="h-5 w-5 text-accent" />
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xl font-display font-bold">
            {(profile?.full_name?.[0] ?? user?.email?.[0] ?? "?").toUpperCase()}
          </div>
          <div>
            {editing ? (
              <div className="flex gap-2">
                <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9" />
                <Button size="sm" onClick={save} disabled={update.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <p className="font-display font-semibold">{profile?.full_name || "No name set"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </>
            )}
          </div>
        </div>
        {!editing && (
          <Button variant="outline" size="sm" onClick={startEdit}>Edit Profile</Button>
        )}
        <div className="text-xs text-muted-foreground">
          Member since {new Date(profile?.created_at ?? Date.now()).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
