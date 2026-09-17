import { useState, useEffect } from "react";
import {
  Building2,
  Globe,
  MapPin,
  Mail,
  Phone,
  Edit,
  Save,
  X,
  Check,
  Calendar,
  Sliders,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Pill from "../../components/ui/Pill.jsx";
import {
  getCompanyProfile,
  updateCompanyProfile,
  subscribe,
} from "../../services/companyService.js";
import {
  COMPANY_INDUSTRIES,
  BRANCHES_LIST,
} from "../../data/companyMockData.js";
import { getInitials } from "../../utils/validators.js";

export default function CompanyProfile() {
  const [profile, setProfile] = useState(getCompanyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    return subscribe(() => {
      setProfile(getCompanyProfile());
    });
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        companyName: profile.companyName || "Tata Consultancy Services (TCS)",
        shortName: profile.shortName || "TCS",
        industry: profile.industry || "Information Technology",
        companySize: profile.companySize || "100,000+ Employees",
        website: profile.website || "https://www.tcs.com",
        headquarters: profile.headquarters || "Mumbai, Maharashtra",
        foundedYear: profile.foundedYear || "1968",
        about: profile.about || "",
        recruiterName: profile.recruiterName || "Priyanka Sharma",
        recruiterRole: profile.recruiterRole || "Campus Talent Acquisition Lead",
        recruiterEmail: profile.recruiterEmail || "priyanka.sharma@tcs.com",
        phone: profile.phone || "+91 98201 23456",
        preferences: {
          branches: profile.preferences?.branches || [
            "Computer Engineering",
            "Information Technology",
          ],
          minCgpa: profile.preferences?.minCgpa || 7.0,
          graduationYear: profile.preferences?.graduationYear || "2026",
          maxBacklogs: profile.preferences?.maxBacklogs || 0,
          preferredLocations: profile.preferences?.preferredLocations || ["Mumbai", "Pune"],
        },
      });
    }
  }, [profile]);

  function handleChange(field, val) {
    setFormData((prev) => ({ ...prev, [field]: val }));
  }

  function handlePrefChange(field, val) {
    setFormData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: val },
    }));
  }

  function toggleBranch(branch) {
    const current = formData.preferences.branches || [];
    const updated = current.includes(branch)
      ? current.filter((b) => b !== branch)
      : [...current, branch];
    handlePrefChange("branches", updated);
  }

  function handleSave(e) {
    e.preventDefault();
    updateCompanyProfile(formData);

    // Sync with localStorage auth user so CompanyNavbar displays updated name
    try {
      const storedRaw = localStorage.getItem("git_careerai_user");
      if (storedRaw) {
        const parsed = JSON.parse(storedRaw);
        parsed.companyName = formData.companyName;
        parsed.fullName = formData.companyName;
        parsed.name = formData.companyName;
        localStorage.setItem("git_careerai_user", JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }

    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  function handleCancel() {
    setIsEditing(false);
    // reset form data to current profile
    setFormData({ ...profile });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <Card padded={false} className="overflow-hidden border border-line">
        <div className="h-32 sm:h-36 bg-gradient-to-r from-ink via-[#183126] to-teal relative" />

        <div className="px-5 sm:px-8 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-2">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 min-w-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-soft text-amber-dark border-4 border-card shadow-md flex items-center justify-center font-display text-2xl sm:text-3xl font-bold shrink-0 z-10">
                {profile.shortName || getInitials(profile.companyName)}
              </div>

              <div className="pt-1 sm:pb-1 min-w-0">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight">
                  {profile.companyName}
                </h1>
                <p className="font-body text-xs sm:text-sm text-ink-soft flex flex-wrap items-center gap-2 mt-1">
                  <span className="font-medium text-ink">{profile.industry}</span>
                  <span className="text-ink-faint">•</span>
                  <span>{profile.headquarters}</span>
                  {profile.companySize && (
                    <>
                      <span className="text-ink-faint">•</span>
                      <span>{profile.companySize}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="shrink-0 pt-2 sm:pt-0 sm:pb-1">
              {!isEditing ? (
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="!py-2 !text-xs w-full sm:w-auto justify-center"
                >
                  <Edit size={14} /> Edit Company Profile
                </Button>
              ) : (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button variant="ghost" onClick={handleCancel} className="!py-2 !text-xs flex-1 sm:flex-initial">
                    <X size={14} /> Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSave} className="!py-2 !text-xs flex-1 sm:flex-initial">
                    <Save size={14} /> Save Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {saveSuccess && (
        <div className="p-3.5 bg-teal-soft border border-teal/20 text-teal-dark font-body text-xs rounded-xl flex items-center gap-2">
          <Check size={16} /> Company profile and placement criteria successfully saved.
        </div>
      )}

      {isEditing && formData ? (
        /* Edit Form Mode */
        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <h2 className="font-display text-lg font-semibold text-ink mb-1">
              Organization Details
            </h2>
            <p className="font-body text-xs text-ink-faint mb-5">
              Public corporate credentials visible to campus students.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="companyName"
                label="Full Company Name"
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
              />

              <FormField
                id="shortName"
                label="Short Brand Name"
                placeholder="e.g. TCS"
                value={formData.shortName}
                onChange={(e) => handleChange("shortName", e.target.value)}
              />

              <FormField
                id="industry"
                label="Industry Domain"
                as="select"
                value={formData.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
              >
                {COMPANY_INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </FormField>

              <FormField
                id="companySize"
                label="Workforce Size"
                placeholder="e.g. 100,000+ Employees"
                value={formData.companySize}
                onChange={(e) => handleChange("companySize", e.target.value)}
              />

              <FormField
                id="website"
                label="Corporate Website URL"
                placeholder="https://..."
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
              />

              <FormField
                id="headquarters"
                label="Headquarters Location"
                placeholder="City, State"
                value={formData.headquarters}
                onChange={(e) => handleChange("headquarters", e.target.value)}
              />

              <FormField
                id="foundedYear"
                label="Founded Year"
                placeholder="e.g. 1968"
                value={formData.foundedYear}
                onChange={(e) => handleChange("foundedYear", e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="block font-body text-sm font-medium text-ink-soft mb-1">
                About the Organization
              </label>
              <textarea
                rows={3}
                value={formData.about}
                onChange={(e) => handleChange("about", e.target.value)}
                className="w-full font-body text-sm text-ink bg-card border border-line rounded-xl p-3 focus:border-teal"
              />
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-lg font-semibold text-ink mb-1">
              Campus Placement SPOC Details
            </h2>
            <p className="font-body text-xs text-ink-faint mb-5">
              Contact person for college placement cell correspondence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="recruiterName"
                label="Primary Contact Name"
                value={formData.recruiterName}
                onChange={(e) => handleChange("recruiterName", e.target.value)}
              />

              <FormField
                id="recruiterRole"
                label="Designation / Role"
                value={formData.recruiterRole}
                onChange={(e) => handleChange("recruiterRole", e.target.value)}
              />

              <FormField
                id="recruiterEmail"
                label="Official Email Address"
                value={formData.recruiterEmail}
                onChange={(e) => handleChange("recruiterEmail", e.target.value)}
              />

              <FormField
                id="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-lg font-semibold text-ink mb-1">
              General Campus Hiring Preferences
            </h2>
            <p className="font-body text-xs text-ink-faint mb-5">
              Default qualification benchmarks applied to campus recruitment drives.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <FormField
                id="minCgpa"
                label="Default Minimum CGPA"
                type="number"
                step="0.1"
                value={formData.preferences.minCgpa}
                onChange={(e) => handlePrefChange("minCgpa", Number(e.target.value))}
              />

              <FormField
                id="maxBacklogs"
                label="Max Active Backlogs"
                type="number"
                value={formData.preferences.maxBacklogs}
                onChange={(e) => handlePrefChange("maxBacklogs", Number(e.target.value))}
              />

              <FormField
                id="gradYear"
                label="Target Passing Year"
                value={formData.preferences.graduationYear}
                onChange={(e) => handlePrefChange("graduationYear", e.target.value)}
              />
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-ink-soft mb-2">
                Preferred Engineering Disciplines
              </label>
              <div className="flex flex-wrap gap-2">
                {BRANCHES_LIST.map((branch) => {
                  const selected = formData.preferences.branches?.includes(branch);
                  return (
                    <button
                      key={branch}
                      type="button"
                      onClick={() => toggleBranch(branch)}
                      className={`font-body text-xs px-3.5 py-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
                        selected
                          ? "bg-teal text-white border-teal shadow-xs"
                          : "bg-paper-dim text-ink-soft border-line hover:border-teal/50"
                      }`}
                    >
                      {selected && <Check size={13} />}
                      {branch}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <Save size={15} /> Save All Changes
            </Button>
          </div>
        </form>
      ) : (
        /* View Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="font-display text-lg font-semibold text-ink mb-3">
                About the Organization
              </h2>
              <p className="font-body text-sm text-ink-soft leading-relaxed">
                {profile.about}
              </p>
            </Card>

            <Card>
              <h2 className="font-display text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                <Sliders size={18} className="text-teal" /> Campus Placement Preferences
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <div className="p-3.5 rounded-xl bg-paper-dim/60 border border-line">
                  <span className="font-body text-xs text-ink-faint block">Minimum CGPA</span>
                  <span className="font-mono text-lg font-semibold text-ink mt-0.5 block">
                    {profile.preferences?.minCgpa} / 10.0
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-paper-dim/60 border border-line">
                  <span className="font-body text-xs text-ink-faint block">Max Backlogs Allowed</span>
                  <span className="font-mono text-lg font-semibold text-ink mt-0.5 block">
                    {profile.preferences?.maxBacklogs === 0
                      ? "None (0)"
                      : `${profile.preferences?.maxBacklogs} allowed`}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-paper-dim/60 border border-line">
                  <span className="font-body text-xs text-ink-faint block">Target Graduation Batch</span>
                  <span className="font-mono text-lg font-semibold text-ink mt-0.5 block">
                    {profile.preferences?.graduationYear}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-body text-xs text-ink-faint block mb-2">
                  Eligible Branches:
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.preferences?.branches?.map((b) => (
                    <Pill key={b} tone="teal">
                      {b}
                    </Pill>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="font-display text-base font-semibold text-ink mb-4">
                Corporate Details
              </h3>

              <div className="space-y-3 font-body text-xs">
                <div className="flex items-center gap-2 text-ink-soft">
                  <Globe size={15} className="text-teal shrink-0" />
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal hover:underline truncate"
                  >
                    {profile.website}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-ink-soft">
                  <Building2 size={15} className="text-ink-faint shrink-0" />
                  <span>{profile.companySize}</span>
                </div>

                <div className="flex items-center gap-2 text-ink-soft">
                  <MapPin size={15} className="text-ink-faint shrink-0" />
                  <span>{profile.headquarters}</span>
                </div>

                <div className="flex items-center gap-2 text-ink-soft">
                  <Calendar size={15} className="text-ink-faint shrink-0" />
                  <span>Founded in {profile.foundedYear}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-display text-base font-semibold text-ink mb-4">
                Campus Talent SPOC
              </h3>

              <div className="space-y-3 font-body text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-soft text-amber-dark font-display font-semibold flex items-center justify-center shrink-0">
                    {getInitials(profile.recruiterName)}
                  </div>
                  <div>
                    <div className="font-semibold text-ink text-sm">{profile.recruiterName}</div>
                    <div className="text-ink-faint text-[11px]">{profile.recruiterRole}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-line space-y-2">
                  <div className="flex items-center gap-2 text-ink-soft">
                    <Mail size={14} className="text-ink-faint shrink-0" />
                    <a href={`mailto:${profile.recruiterEmail}`} className="text-teal hover:underline">
                      {profile.recruiterEmail}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-ink-soft">
                    <Phone size={14} className="text-ink-faint shrink-0" />
                    <span className="font-mono">{profile.phone}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
