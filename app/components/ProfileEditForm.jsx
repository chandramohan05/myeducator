"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export default function ProfileEditForm({ user, onSubmit, onCancel }) {
  console.log("ProfileEditForm received user:", user);
  
  const [formData, setFormData] = useState({
    Student_name: user?.Student_name || "",
    mobile: user?.mobile || "",
    bio: user?.bio || "",
    location: user?.location || "",
    fide_id: user?.fide_id || "",
    aicf_id: user?.aicf_id || "",
    state_id_classical: user?.state_id_classical || "",
    state_id_rapid: user?.state_id_rapid || "",
    state_id_blitz: user?.state_id_blitz || "",
    lichess_id: user?.lichess_id || "",
    chesscom_id: user?.chesscom_id || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.Student_name.trim()) throw new Error("Name is required");
      await onSubmit(formData);

      if (onCancel) onCancel();
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  name="Student_name"
                  value={formData.Student_name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Contact Number</label>
                <Input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Your mobile number"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Your location"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Chess IDs Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Chess Identifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">FIDE ID</label>
                <Input
                  name="fide_id"
                  value={formData.fide_id}
                  onChange={handleChange}
                  placeholder="International Chess Federation ID"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">AICF ID</label>
                <Input
                  name="aicf_id"
                  value={formData.aicf_id}
                  onChange={handleChange}
                  placeholder="All India Chess Federation ID"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">State ID (Classical)</label>
                <Input
                  name="state_id_classical"
                  value={formData.state_id_classical}
                  onChange={handleChange}
                  placeholder="State Classical ID"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">State ID (Rapid)</label>
                <Input
                  name="state_id_rapid"
                  value={formData.state_id_rapid}
                  onChange={handleChange}
                  placeholder="State Rapid ID"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">State ID (Blitz)</label>
                <Input
                  name="state_id_blitz"
                  value={formData.state_id_blitz}
                  onChange={handleChange}
                  placeholder="State Blitz ID"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Lichess Username</label>
                <Input
                  name="lichess_id"
                  value={formData.lichess_id}
                  onChange={handleChange}
                  placeholder="Your Lichess username"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium">Chess.com Username</label>
                <Input
                  name="chesscom_id"
                  value={formData.chesscom_id}
                  onChange={handleChange}
                  placeholder="Your Chess.com username"
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          {onCancel && (
            <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}