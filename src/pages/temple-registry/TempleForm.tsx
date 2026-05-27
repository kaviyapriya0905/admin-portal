import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Camera, Edit3, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";
import { getMockData, updateMockItem } from "@/utils/mockData";
import SmartField from "@/components/ui/SmartField";
import SmartTextarea from "@/components/ui/SmartTextarea";

interface Temple {
  id: string;
  name: string;
  location: string;
  address: string;
  description: string;
  historicalContext?: string;
  image: string;
  city?: string;
  state?: string;
  country?: string;
  status: "active" | "inactive";
  bio?: string;
  superadmin?: {
    firstName: string;
    lastName: string;
    email: string;
    bio?: string;
  };
}

const TempleForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const heroInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Temple>({
    id: "",
    name: "",
    location: "",
    address: "",
    description: "",
    historicalContext: "",
    image: "",
    city: "",
    state: "",
    country: "",
    status: "active",
    bio: "",
    superadmin: {
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
    }
  });
  
  const [previewHero, setPreviewHero] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const mockData = getMockData();
      const templesData = mockData.temples || [];
      const foundTemple: any = templesData.find((t: any) => t.id === id || t._id === id || t.temple_id === id);
      
      if (foundTemple) {
        let parsedHistory: any[] = [];
        if (Array.isArray(foundTemple.history)) {
          parsedHistory = foundTemple.history;
        } else if (typeof foundTemple.history === "string") {
          try {
            parsedHistory = JSON.parse(foundTemple.history);
          } catch (e) {
            // ignore
          }
        }

        setFormData({
          id: foundTemple.id || foundTemple._id || foundTemple.temple_id || "",
          name: foundTemple.name || "",
          location: `${foundTemple.city || ""}, ${foundTemple.state || ""}`,
          address: foundTemple.address || "",
          description: foundTemple.description && foundTemple.description !== "None" ? foundTemple.description : (foundTemple.historicalsig && foundTemple.historicalsig !== "None" ? foundTemple.historicalsig : ""),
          historicalContext: foundTemple.historicalContext && foundTemple.historicalContext !== "None" ? foundTemple.historicalContext : (parsedHistory && parsedHistory[0] && parsedHistory[0].description ? parsedHistory[0].description : ""),
          image: foundTemple.logo || (parsedHistory && parsedHistory[0] && parsedHistory[0].banner) || (parsedHistory && parsedHistory[0] && parsedHistory[0].logo) || "/temple1.png",
          city: foundTemple.city || "",
          state: foundTemple.state || "",
          country: foundTemple.country || "",
          status: foundTemple.status === "inactive" ? "inactive" : "active",
          bio: foundTemple.bio === "None" ? "" : foundTemple.bio || "",
          superadmin: foundTemple.superadmin ? {
            firstName: foundTemple.superadmin.firstName || foundTemple.superadmin.first_name || "",
            lastName: foundTemple.superadmin.lastName || foundTemple.superadmin.last_name || "",
            email: foundTemple.superadmin.email || "",
            bio: foundTemple.superadmin.bio || "",
          } : undefined
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
        setPreviewHero(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    updateMockItem("temples", id, {
       name: formData.name,
       city: formData.city,
       state: formData.state,
       country: formData.country,
       address: formData.address,
       bio: formData.bio === "None" ? "" : formData.bio || "",
       historicalContext: formData.historicalContext,
       logo: previewHero || formData.image,
       superadmin: formData.superadmin ? {
         ...formData.superadmin
       } : undefined
    });
    
    toast.success("Temple registry updated successfully!");
    navigate("/temple-onboard");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="shrink-0 bg-[#fafafa] border-b border-slate-100 pb-4 mb-0 space-y-4">
        <div className="flex items-start sm:items-center gap-4">
          <button onClick={() => navigate("/temple-onboard")} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shrink-0 mt-1 sm:mt-0">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Edit Temple Registry</h1>
            <p className="text-xs sm:text-sm text-slate-500">Spiritual identity & branch details update.</p>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-6 py-6 pb-12 animate-in fade-in duration-500">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col space-y-8">
            
            <div className="space-y-4">
              <label className="block text-[11px] font-bold text-slate-400 normal-case tracking-normal ml-1">
                Official facade portrait
              </label>
              <div
                onClick={() => heroInputRef.current?.click()}
                className="relative aspect-video rounded-md border-2 border-dashed border-slate-100 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all overflow-hidden group bg-slate-50"
              >
                {(() => {
                  if (previewHero) {
                    return (
                      <img src={previewHero} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    );
                  }

                  if (formData.image && formData.image !== "None") {
                    return (
                      <img src={formData.image} alt="Cached" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    );
                  }

                  return (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white rounded-md shadow-sm border border-slate-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Camera className="w-6 h-6 text-brand-primary" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold normal-case tracking-normal">
                        Update facade image
                      </span>
                    </div>
                  );
                })()}
                <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white/20 p-4 rounded-full border border-white/30">
                    <Edit3 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <input type="file" ref={heroInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              
              <div className="mt-4">
                <SmartField
                  icon={LinkIcon}
                  label="Or paste Facade Image URL"
                  value={previewHero && previewHero.startsWith("http") ? previewHero : ""}
                  onChange={(val) => {
                    setPreviewHero(val);
                    setFormData({ ...formData, image: val });
                  }}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-6">
              <SmartField label="Temple / unit name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SmartField label="City hub" value={formData.city || ""} onChange={(v) => setFormData({ ...formData, city: v })} />
                <SmartField label="State / region" value={formData.state || ""} onChange={(v) => setFormData({ ...formData, state: v })} />
              </div>

              <SmartField label="Country / jurisdiction" value={formData.country || ""} onChange={(v) => setFormData({ ...formData, country: v })} />

              <SmartTextarea
                label="Physical address"
                value={formData.address}
                onChange={(val) => setFormData({ ...formData, address: val })}
              />

              <SmartTextarea
                label="Unit overview & summary (Bio)"
                value={formData.bio || ""}
                onChange={(val) => setFormData({ ...formData, bio: val })}
                placeholder="Briefly describe the primary mission or summary of this branch..."
              />

              <SmartTextarea
                label="Historical context (Optional)"
                value={formData.historicalContext || ""}
                onChange={(val) => setFormData({ ...formData, historicalContext: val })}
                placeholder="Document the temple's history, cultural legacy, and spiritual heritage..."
              />

              {formData.superadmin && (
                <div className="pt-6 border-t border-slate-100 space-y-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                      Executive Profile
                    </span>
                  </div>

                  <SmartField 
                    label="Super admin full name" 
                    value={`${formData.superadmin.firstName} ${formData.superadmin.lastName}`.trim()} 
                    onChange={(v) => {
                      const parts = v.trim().split(" ");
                      const first = parts[0];
                      const last = parts.length > 1 ? parts.slice(1).join(" ") : "";
                      setFormData({ ...formData, superadmin: { ...formData.superadmin!, firstName: first, lastName: last } });
                    }} 
                  />

                  <SmartTextarea
                    label="Executive bio"
                    value={formData.superadmin.bio || ""}
                    onChange={(val) => setFormData({ ...formData, superadmin: { ...formData.superadmin!, bio: val } })}
                  />
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
              <button type="button" onClick={() => navigate("/temple-onboard")} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">Discard</button>
              <button type="submit" className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 hover:bg-[#8e330b] transition-all flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                Update Registry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TempleForm;
