"use client";

import { useEffect, useRef, useState } from "react";
import {
  useGetCurrentUserQuery,
  useUpdateUserMutation,
} from "@/services/api/userApi";
import { useAuth } from "@/hooks/useAuth"; // Import the useAuth hook
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import {
  Mail,
  LinkIcon,
  Twitter,
  Github,
  Linkedin,
  Edit3,
  X,
  Upload,
  Trash2,
  Check,
  Camera,
  Lock,
} from "lucide-react";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Use the useAuth hook for authentication
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const {
    data: userData,
    isLoading: userDataLoading,
    isError,
    refetch: refetchUser,
  } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated, // Skip the query if not authenticated
  });

  const [updateUser] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    website: "",
    twitter: "",
    github: "",
    linkedin: "",
  });

  const [originalData, setOriginalData] = useState(formData);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        bio: userData.bio || "",
        website: userData.website || "",
        twitter: userData.twitter || "",
        github: userData.github || "",
        linkedin: userData.linkedin || "",
      });
      setOriginalData({
        name: userData.name || "",
        email: userData.email || "",
        bio: userData.bio || "",
        website: userData.website || "",
        twitter: userData.twitter || "",
        github: userData.github || "",
        linkedin: userData.linkedin || "",
      });
      if (userData.profile_image) {
        setImagePreview(userData.profile_image);
      }
    }
  }, [userData]);

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(
          "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
        );
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setProfileImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Image removed");
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setImagePreview(userData?.profile_image || null);
    setProfileImage(null);
    setIsEditing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      if (formData.bio) form.append("bio", formData.bio);
      if (formData.website) form.append("website", formData.website);
      if (formData.twitter) form.append("twitter", formData.twitter);
      if (formData.github) form.append("github", formData.github);
      if (formData.linkedin) form.append("linkedin", formData.linkedin);
      if (profileImage) form.append("profile_image", profileImage);

      await updateUser(form).unwrap();
      toast.success("Profile updated!");
      setOriginalData({ ...formData });
      setProfileImage(null);
      setIsEditing(false);
      refetchUser();
    } catch (err) {
      toast.error("Failed to update profile");
      console.error("Update error:", err);
    }
  };

  // Show loading state while checking authentication
  if (authLoading || userDataLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show authentication required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center h-40 text-center space-y-4">
                <Lock className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">
                  Authentication Required
                </h2>
                <p className="text-muted-foreground">
                  Please log in to view and edit your profile.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show error state if there's an error loading user data
  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center h-40 text-center space-y-4">
                <X className="h-12 w-12 text-red-500" />
                <h2 className="text-2xl font-semibold text-red-500">Error</h2>
                <p className="text-muted-foreground">
                  Failed to load profile data. Please try refreshing the page.
                </p>
                <Button onClick={() => refetchUser()} variant="outline">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              <div className="relative group flex-shrink-0">
                <Avatar
                  className={`h-40 w-40 ring-4 ring-background shadow-lg ${
                    isEditing ? "cursor-pointer" : ""
                  }`}
                  onClick={isEditing ? triggerImageUpload : undefined}
                >
                  <AvatarImage
                    src={imagePreview || "/placeholder.svg"}
                    alt={formData.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-5xl">
                    {formData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <>
                    <div
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={triggerImageUpload}
                    >
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    {profileImage && (
                      <Button
                        size="sm"
                        onClick={handleRemoveImage}
                        variant="destructive"
                        className="absolute top-3 right-3 h-8 w-8 rounded-full p-0 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={triggerImageUpload}
                      variant="secondary"
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-8 px-3 text-xs"
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      {profileImage ? "Change" : "Upload"}
                    </Button>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="flex-1 text-center lg:text-left space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-3">
                    {isEditing ? (
                      <>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            handleFieldChange("name", e.target.value)
                          }
                        />
                      </>
                    ) : (
                      <h1 className="text-4xl font-bold">{formData.name}</h1>
                    )}

                    {isEditing ? (
                      <>
                        <Label htmlFor="email">Email</Label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            disabled
                          />
                        </div>
                      </>
                    ) : (
                      <p className="text-muted-foreground flex items-center justify-center lg:justify-start gap-2 text-lg">
                        <Mail className="h-5 w-5" />
                        {formData.email}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleSave}
                          size="lg"
                          className="px-6 cursor-pointer"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          size="lg"
                          className="px-6 cursor-pointer"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        size="lg"
                        className="px-6 cursor-pointer"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleFieldChange("bio", e.target.value)}
                      rows={4}
                    />
                  ) : (
                    <p className="text-foreground leading-relaxed text-lg">
                      {formData.bio || "No bio added yet."}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-5 w-5 text-muted-foreground" />
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) =>
                          handleFieldChange("website", e.target.value)
                        }
                        placeholder="https://your-website.com"
                      />
                    </div>
                  ) : (
                    formData.website && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-muted-foreground" />
                        <a
                          href={formData.website}
                          className="text-primary hover:underline text-lg"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {formData.website}
                        </a>
                      </div>
                    )
                  )}
                </div>

                {/* Social Media Links - Show in view mode if they exist */}
                {!isEditing &&
                  (formData.twitter ||
                    formData.github ||
                    formData.linkedin) && (
                    <div className="space-y-2">
                      <Label>Social Media</Label>
                      <div className="flex flex-wrap gap-4">
                        {formData.twitter && (
                          <a
                            href={`https://twitter.com/${formData.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            <Twitter className="h-4 w-4" />@{formData.twitter}
                          </a>
                        )}
                        {formData.github && (
                          <a
                            href={`https://github.com/${formData.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            <Github className="h-4 w-4" />
                            {formData.github}
                          </a>
                        )}
                        {formData.linkedin && (
                          <a
                            href={`https://linkedin.com/in/${formData.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            <Linkedin className="h-4 w-4" />
                            {formData.linkedin}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                {isEditing && (
                  <>
                    <Label>Social Media</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {["twitter", "github", "linkedin"].map((platform) => (
                        <div key={platform}>
                          <Label htmlFor={platform} className="capitalize">
                            {platform}
                          </Label>
                          <Input
                            id={platform}
                            value={formData[platform as keyof typeof formData]}
                            onChange={(e) =>
                              handleFieldChange(
                                platform as keyof typeof formData,
                                e.target.value
                              )
                            }
                            placeholder={
                              platform === "twitter"
                                ? "username"
                                : platform === "github"
                                ? "username"
                                : "profile-name"
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
