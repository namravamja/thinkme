"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef } from "react";
import toast from "react-hot-toast";
import {
  Mail,
  LinkIcon,
  Twitter,
  Github,
  Linkedin,
  Edit3,
  Save,
  X,
  Upload,
  Trash2,
  Check,
  Camera,
  LogIn,
} from "lucide-react";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Passionate writer and tech enthusiast. Love sharing insights about web development, design, and the future of technology.",
    website: "https://johndoe.dev",
    twitter: "@johndoe",
    github: "johndoe",
    linkedin: "johndoe",
  });
  const [originalData, setOriginalData] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Passionate writer and tech enthusiast. Love sharing insights about web development, design, and the future of technology.",
    website: "https://johndoe.dev",
    twitter: "@johndoe",
    github: "johndoe",
    linkedin: "johndoe",
  });

  // No auth: use default profile data

  interface ImageUploadEvent extends React.ChangeEvent<HTMLInputElement> {}

  interface FileReaderEventTarget extends EventTarget {
    result: string | ArrayBuffer | null;
  }

  const handleImageUpload = (event: ImageUploadEvent) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
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

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setProfileImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const target = e.target as FileReaderEventTarget;
        setImagePreview(target.result as string);
      };
      reader.readAsDataURL(file);

      toast.success("Image selected successfully");
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Image removed");
  };

  const handleSave = () => {
    // Mock save functionality
    if (profileImage) {
      console.log("Uploading image:", profileImage);
    }

    setOriginalData({ ...formData });
    toast.success("Profile updated successfully!");
    setIsEditing(false);
    setProfileImage(null);
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setImagePreview(null);
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsEditing(false);
  };

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Avatar Section */}
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

                  {/* Upload overlay when editing */}
                  {isEditing && (
                    <div
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={triggerImageUpload}
                    >
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  )}

                  {/* Remove button for uploaded image */}
                  {isEditing && profileImage && (
                    <Button
                      size="sm"
                      onClick={handleRemoveImage}
                      variant="destructive"
                      className="absolute top-3 right-3 h-8 w-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Upload button when editing */}
                  {isEditing && (
                    <Button
                      size="sm"
                      onClick={triggerImageUpload}
                      variant="secondary"
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-8 px-3 text-xs cursor-pointer"
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      {profileImage ? "Change" : "Upload"}
                    </Button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="space-y-3">
                      {/* Name Field */}
                      {isEditing ? (
                        <div className="space-y-2">
                          <Label
                            htmlFor="name"
                            className="text-sm font-medium text-muted-foreground"
                          >
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              handleFieldChange("name", e.target.value)
                            }
                            className="text-3xl font-bold border-2 border-dashed border-primary/20 focus:border-primary h-auto py-2 px-3"
                          />
                        </div>
                      ) : (
                        <h1 className="text-4xl font-bold">{formData.name}</h1>
                      )}

                      {/* Email Field */}
                      {isEditing ? (
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium text-muted-foreground"
                          >
                            Email
                          </Label>
                          <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                handleFieldChange("email", e.target.value)
                              }
                              className="border-2 border-dashed border-primary/20 focus:border-primary h-auto py-1 px-2"
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground flex items-center justify-center lg:justify-start gap-2 text-lg">
                          <Mail className="h-5 w-5" />
                          {formData.email}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {isEditing ? (
                        <>
                          <Button
                            onClick={handleSave}
                            size="lg"
                            className="px-6"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            onClick={handleCancel}
                            variant="outline"
                            size="lg"
                            className="px-6"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => setIsEditing(true)}
                          size="lg"
                          className="px-6"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="max-w-2xl">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Label
                          htmlFor="bio"
                          className="text-sm font-medium text-muted-foreground"
                        >
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) =>
                            handleFieldChange("bio", e.target.value)
                          }
                          rows={4}
                          className="border-2 border-dashed border-primary/20 focus:border-primary resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    ) : (
                      <p className="text-foreground leading-relaxed text-lg">
                        {formData.bio}
                      </p>
                    )}
                  </div>

                  {/* Website */}
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    {isEditing ? (
                      <div className="space-y-2 w-full max-w-md">
                        <Label
                          htmlFor="website"
                          className="text-sm font-medium text-muted-foreground"
                        >
                          Website
                        </Label>
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-5 w-5 text-muted-foreground" />
                          <Input
                            id="website"
                            type="url"
                            value={formData.website}
                            onChange={(e) =>
                              handleFieldChange("website", e.target.value)
                            }
                            className="border-2 border-dashed border-primary/20 focus:border-primary h-auto py-1 px-2"
                            placeholder="https://your-website.com"
                          />
                        </div>
                      </div>
                    ) : (
                      formData.website && (
                        <>
                          <LinkIcon className="h-5 w-5 text-muted-foreground" />
                          <a
                            href={formData.website}
                            className="text-primary hover:underline text-lg cursor-pointer"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {formData.website}
                          </a>
                        </>
                      )
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4">
                    {isEditing && (
                      <Label className="text-sm font-medium text-muted-foreground">
                        Social Media
                      </Label>
                    )}

                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Twitter */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="twitter"
                            className="text-xs font-medium text-muted-foreground"
                          >
                            Twitter
                          </Label>
                          <div className="flex items-center gap-2">
                            <Twitter className="h-4 w-4 text-muted-foreground" />
                            <Input
                              id="twitter"
                              value={formData.twitter}
                              onChange={(e) =>
                                handleFieldChange("twitter", e.target.value)
                              }
                              className="border-2 border-dashed border-primary/20 focus:border-primary h-auto py-1 px-2 text-sm"
                              placeholder="@username"
                            />
                          </div>
                        </div>

                        {/* GitHub */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="github"
                            className="text-xs font-medium text-muted-foreground"
                          >
                            GitHub
                          </Label>
                          <div className="flex items-center gap-2">
                            <Github className="h-4 w-4 text-muted-foreground" />
                            <Input
                              id="github"
                              value={formData.github}
                              onChange={(e) =>
                                handleFieldChange("github", e.target.value)
                              }
                              className="border-2 border-dashed border-primary/20 focus:border-primary h-auto py-1 px-2 text-sm"
                              placeholder="username"
                            />
                          </div>
                        </div>

                        {/* LinkedIn */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="linkedin"
                            className="text-xs font-medium text-muted-foreground"
                          >
                            LinkedIn
                          </Label>
                          <div className="flex items-center gap-2">
                            <Linkedin className="h-4 w-4 text-muted-foreground" />
                            <Input
                              id="linkedin"
                              value={formData.linkedin}
                              onChange={(e) =>
                                handleFieldChange("linkedin", e.target.value)
                              }
                              className="border-2 border-dashed border-primary/20 focus:border-primary h-auto py-1 px-2 text-sm"
                              placeholder="username"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center lg:justify-start gap-4 flex-wrap">
                        {formData.twitter && (
                          <Button
                            variant="outline"
                            size="lg"
                            className="px-6 cursor-pointer"
                          >
                            <Twitter className="h-4 w-4 mr-2" />
                            {formData.twitter}
                          </Button>
                        )}
                        {formData.github && (
                          <Button
                            variant="outline"
                            size="lg"
                            className="px-6 cursor-pointer"
                          >
                            <Github className="h-4 w-4 mr-2" />
                            {formData.github}
                          </Button>
                        )}
                        {formData.linkedin && (
                          <Button
                            variant="outline"
                            size="lg"
                            className="px-6 cursor-pointer"
                          >
                            <Linkedin className="h-4 w-4 mr-2" />
                            {formData.linkedin}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
