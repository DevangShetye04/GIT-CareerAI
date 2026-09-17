import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Building,
  UserCheck,
  CheckSquare,
  Square,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import { getStudentInterviews, subscribe } from "../../services/studentService.js";

export default function StudentInterviews() {
  const [interviews, setInterviews] = useState(getStudentInterviews());
  const [prepChecklist, setPrepChecklist] = useState({
    micCam: true,
    resumeCopy: true,
    collegeId: false,
    projectReview: true,
    quietRoom: false,
  });
  const [meetingToast, setMeetingToast] = useState("");

  useEffect(() => {
    const unsub = subscribe(() => {
      setInterviews(getStudentInterviews());
    });
    return () => unsub();
  }, []);

  const toggleCheck = (key) => {
    setPrepChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const upcomingInterviews = interviews.filter((i) => i.status === "Scheduled");
  const completedInterviews = interviews.filter((i) => i.status === "Completed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Interview Schedule &amp; Preparation
        </h1>
        <p className="font-body text-sm text-ink-soft mt-1">
          Stay on top of upcoming campus placement technical and HR rounds, access meeting rooms, and prepare.
        </p>
      </div>

      {meetingToast && (
        <div className="p-4 rounded-xl bg-teal-soft text-teal-dark border border-teal/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 size={18} />
            <span>{meetingToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setMeetingToast("")}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Left Interviews, Right Prep Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interviews List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
                <Calendar size={18} /> Upcoming Placement Interviews
              </h2>
              <Pill tone="amber">{upcomingInterviews.length} Scheduled</Pill>
            </div>

            {upcomingInterviews.length === 0 ? (
              <Card className="text-center py-8">
                <Clock size={32} className="mx-auto text-ink-faint mb-2" />
                <p className="font-display text-sm font-semibold text-ink">
                  No interviews scheduled.
                </p>
                <p className="font-body text-xs text-ink-soft mt-1">
                  Once your applications are shortlisted, recruiters will schedule interview slots here.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingInterviews.map((item) => (
                  <Card key={item.id} className="border-l-4 border-l-amber">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-paper-dim border border-line flex items-center justify-center font-display font-bold text-lg text-ink shrink-0">
                          {item.company?.[0] || "C"}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-base font-semibold text-ink">
                              {item.role}
                            </h3>
                            <Pill tone="amber">{item.round}</Pill>
                          </div>
                          <p className="font-body text-xs text-ink-soft flex items-center gap-1 mt-0.5">
                            <Building size={12} /> {item.company}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-xs font-body text-ink mt-3">
                            <div className="flex items-center gap-1 font-mono font-medium">
                              <Calendar size={13} className="text-ink-soft" /> {item.date}
                            </div>
                            <div className="flex items-center gap-1 font-mono font-medium">
                              <Clock size={13} className="text-ink-soft" /> {item.time} ({item.duration || "45m"})
                            </div>
                            <div className="flex items-center gap-1 font-medium text-ink-soft">
                              {item.mode === "Online" || item.mode === "Virtual" ? (
                                <>
                                  <Video size={13} className="text-teal" /> Virtual Meeting
                                </>
                              ) : (
                                <>
                                  <MapPin size={13} className="text-amber-dark" /> {item.venue || "Campus Placement Hall"}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        {item.meetingLink ? (
                          <Button
                            variant="primary"
                            className="!py-2 !px-4 !text-xs w-full sm:w-auto"
                            onClick={() =>
                              setMeetingToast(
                                `Simulating opening secure video interview room for ${item.company}...`
                              )
                            }
                          >
                            <Video size={14} /> Join Video Room
                          </Button>
                        ) : (
                          <Pill tone="neutral">{item.venue || "Placement Block B"}</Pill>
                        )}
                      </div>
                    </div>

                    {/* Interview Focus Topics */}
                    {item.topics && item.topics.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-line">
                        <span className="font-body text-[11px] uppercase tracking-wider text-ink-faint font-semibold block mb-1.5">
                          Round Focus Topics
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.topics.map((t, idx) => (
                            <span
                              key={idx}
                              className="font-mono text-[11px] px-2.5 py-0.5 rounded-md bg-paper-dim text-ink"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Past / Completed Interviews */}
          {completedInterviews.length > 0 && (
            <div>
              <h2 className="font-display text-base font-semibold text-ink mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} /> Completed Interview Rounds
              </h2>
              <div className="space-y-3">
                {completedInterviews.map((item) => (
                  <Card key={item.id} className="opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-display text-sm font-semibold text-ink">
                          {item.role} — {item.round}
                        </h4>
                        <p className="font-body text-xs text-ink-soft">
                          {item.company} • {item.date}
                        </p>
                      </div>
                      <Pill tone="teal">
                        <CheckCircle2 size={11} /> {item.result || "Cleared"}
                      </Pill>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Checklist & Prep Guide */}
        <div className="space-y-6">
          {/* Prep Checklist Card */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
                <CheckSquare size={16} /> Pre-Interview Checklist
              </h3>
              <span className="font-mono text-xs text-ink-soft">
                {Object.values(prepChecklist).filter(Boolean).length}/5 Done
              </span>
            </div>
            <p className="font-body text-xs text-ink-soft mb-4">
              Tick items off as you prepare for your technical &amp; behavioral campus rounds.
            </p>

            <div className="space-y-2.5 text-xs font-body">
              <label
                onClick={() => toggleCheck("micCam")}
                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-paper-dim cursor-pointer select-none"
              >
                {prepChecklist.micCam ? (
                  <CheckSquare size={16} className="text-teal shrink-0 mt-0.5" />
                ) : (
                  <Square size={16} className="text-ink-faint shrink-0 mt-0.5" />
                )}
                <span className={prepChecklist.micCam ? "line-through text-ink-soft" : "text-ink"}>
                  Test microphone, headphones, and HD webcam lighting
                </span>
              </label>

              <label
                onClick={() => toggleCheck("resumeCopy")}
                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-paper-dim cursor-pointer select-none"
              >
                {prepChecklist.resumeCopy ? (
                  <CheckSquare size={16} className="text-teal shrink-0 mt-0.5" />
                ) : (
                  <Square size={16} className="text-ink-faint shrink-0 mt-0.5" />
                )}
                <span className={prepChecklist.resumeCopy ? "line-through text-ink-soft" : "text-ink"}>
                  Keep PDF copy and 2 printed copies of approved resume
                </span>
              </label>

              <label
                onClick={() => toggleCheck("collegeId")}
                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-paper-dim cursor-pointer select-none"
              >
                {prepChecklist.collegeId ? (
                  <CheckSquare size={16} className="text-teal shrink-0 mt-0.5" />
                ) : (
                  <Square size={16} className="text-ink-faint shrink-0 mt-0.5" />
                )}
                <span className={prepChecklist.collegeId ? "line-through text-ink-soft" : "text-ink"}>
                  College Identity Card / Govt Photo ID verification ready
                </span>
              </label>

              <label
                onClick={() => toggleCheck("projectReview")}
                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-paper-dim cursor-pointer select-none"
              >
                {prepChecklist.projectReview ? (
                  <CheckSquare size={16} className="text-teal shrink-0 mt-0.5" />
                ) : (
                  <Square size={16} className="text-ink-faint shrink-0 mt-0.5" />
                )}
                <span className={prepChecklist.projectReview ? "line-through text-ink-soft" : "text-ink"}>
                  Review capstone project architecture and GitHub repositories
                </span>
              </label>

              <label
                onClick={() => toggleCheck("quietRoom")}
                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-paper-dim cursor-pointer select-none"
              >
                {prepChecklist.quietRoom ? (
                  <CheckSquare size={16} className="text-teal shrink-0 mt-0.5" />
                ) : (
                  <Square size={16} className="text-ink-faint shrink-0 mt-0.5" />
                )}
                <span className={prepChecklist.quietRoom ? "line-through text-ink-soft" : "text-ink"}>
                  Secure a quiet, high-speed internet room with backup hotspot
                </span>
              </label>
            </div>
          </Card>

          {/* Quick Tips */}
          <Card>
            <h3 className="font-display text-sm font-semibold text-ink mb-2 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-dark" /> Placement Cell Pro Tip
            </h3>
            <p className="font-body text-xs text-ink-soft leading-relaxed">
              In technical interviews, recruiters care as much about your problem-solving thought process as the final syntax. Think out loud, clarify constraints, and write modular code.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
