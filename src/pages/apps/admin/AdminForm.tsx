import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Camera, User } from "lucide-react";
import toast from "react-hot-toast";
import { getMockData, updateMockItem } from "../../../utils/mockData";
import SmartField from "../../../components/ui/SmartField";

interface AdminMember {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  status: "Active" | "Pending" | "Inactive";
  dateJoined: string;
  image: string;
  templeName?: string;
  bio?: string;
}

const AdminForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<AdminMember>({
    id: "",
    name: "",
    email: "",
    username: "",
    role: "",
    status: "Active",
    dateJoined: "",
    image: "",
    bio: "",
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const mockData = getMockData();
      const usersData = mockData.users || [];
      let foundUser = usersData.find((u: any) => u.id === id || u.id?.toString() === id);
      
      if (!foundUser) {
        // Also check superadmins in temples
        const mappedTemples = (mockData.temples || []);
        mappedTemples.forEach((t: any) => {
          if (t.superadmin && (t.superadmin.id === id || t.superadmin.id?.toString() === id)) {
            foundUser = t.superadmin;
          }
        });
      }

      if (foundUser) {
        setFormData({
          id: foundUser.id?.toString() || "",
          name: `${foundUser.firstName || foundUser.first_name || ""} ${foundUser.lastName || foundUser.last_name || ""}`.trim(),
          email: foundUser.email || "",
          username: `ID: #${(foundUser.id || "").toString().substring(0, 4).padStart(4, "0")}`,
          role: foundUser.role?.name || foundUser.Role?.role_name || (typeof foundUser.role === "string" ? foundUser.role : "Admin"),
          status: foundUser.accountStatus === "inactive" || foundUser.status === "Inactive" ? "Inactive" : "Active",
          dateJoined: foundUser.createdAt || "",
          image: foundUser.profilePic || foundUser.image || "",
          bio: foundUser.bio || "",
        });
      }
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be under 2MB for browser persistence.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    updateMockItem("users", id, {
       firstName: formData.name.split(' ')[0] || '',
       lastName: formData.name.split(' ').slice(1).join(' ') || '',
       name: formData.name,
       status: formData.status,
       accountStatus: formData.status.toLowerCase(),
       bio: formData.bio,
       image: formData.image,
       profilePic: formData.image
    });
    
    toast.success("Admin profile updated successfully!");
    navigate("/admin-onboard");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="shrink-0 bg-[#fafafa] border-b border-slate-100 pb-4 mb-0 space-y-4">
        <div className="flex items-start sm:items-center gap-4">
          <button onClick={() => navigate("/admin-onboard")} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shrink-0 mt-1 sm:mt-0">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Edit Admin Profile</h1>
            <p className="text-xs sm:text-sm text-slate-500">Personnel Registry update & access control.</p>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-6 py-6 pb-12 animate-in fade-in duration-500">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col space-y-8">
            
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col items-center gap-4 group/avatar relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10 group/img cursor-pointer"
              >
                {(() => {
                  const finalImage = previewImage || (formData.image && formData.image !== "None" ? formData.image : null);

                  if (finalImage) {
                    return (
                      <>
                        <img
                          src={finalImage}
                          alt="Admin"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                        />
                        <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                      </>
                    );
                  }

                  return (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center group-hover/img:bg-slate-200 transition-colors">
                      <User className="w-8 h-8 text-slate-300" />
                      <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  );
                })()}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />

              <div className="text-center relative z-10">
                <p className="text-slate-900 font-bold text-lg tracking-tight">
                  {formData.name || "Unknown"}
                </p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  {formData.role}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <SmartField 
                label="Legal full name" 
                value={formData.name} 
                onChange={(v) => setFormData({ ...formData, name: v })} 
              />
              
              <div className="group/field">
                <label className="block text-[11px] font-bold text-slate-400 normal-case tracking-normal mb-1.5 ml-1 group-focus-within/field:text-brand-primary transition-colors">
                  Corporate email identifier
                </label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-md text-[12px] text-slate-400 cursor-not-allowed font-medium"
                />
                <p className="text-[9px] text-slate-400 mt-1 ml-1 font-medium">
                  Email address modification requires high-level system override.
                </p>
              </div>

              <div className="group/field">
                <label className="block text-[11px] font-bold text-slate-400 normal-case tracking-normal mb-1.5 ml-1 group-focus-within/field:text-brand-primary transition-colors">
                  Governance lifecycle status
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-md text-[12px] focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary focus:bg-white transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="Active">Protocol: Active</option>
                    <option value="Pending">Protocol: Pending Review</option>
                    <option value="Inactive">Protocol: Deactivated</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  </div>
                </div>
              </div>

              <div className="group/field">
                <label className="block text-[11px] font-bold text-slate-400 normal-case tracking-normal mb-1.5 ml-1 group-focus-within/field:text-brand-primary transition-colors">
                  Professional Biography
                </label>
                <textarea
                  value={formData.bio === "None" ? "" : formData.bio || ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-md text-[12px] focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary focus:bg-white transition-all font-medium text-slate-900 min-h-[100px] resize-none"
                  placeholder="Brief background or mission statement..."
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
              <button type="button" onClick={() => navigate("/admin-onboard")} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">Discard</button>
              <button type="submit" className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 hover:bg-[#8e330b] transition-all flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                Synchronize Registry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminForm;
