import React, { useState } from 'react';
import { MemberBaseProfile } from '../../../types';
import { X, User, Heart, AlertCircle, Phone, FileText, Check, Plus, Trash2 } from 'lucide-react';

interface EditBaseProfileModalProps {
  profile: MemberBaseProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<MemberBaseProfile>) => void;
}

export const EditBaseProfileModal: React.FC<EditBaseProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [age, setAge] = useState(profile.age);
  const [bloodType, setBloodType] = useState(profile.bloodType || '');
  const [emergencyContact, setEmergencyContact] = useState(profile.emergencyContact);
  const [notes, setNotes] = useState(profile.notes);
  const [allergies, setAllergies] = useState<string[]>(profile.allergies || []);
  const [newAllergyInput, setNewAllergyInput] = useState('');
  const [chronicConditions, setChronicConditions] = useState<string[]>(
    profile.chronicConditions || []
  );
  const [newChronicInput, setNewChronicInput] = useState('');

  const handleAddAllergy = () => {
    if (!newAllergyInput.trim()) return;
    setAllergies((prev) => [...prev, newAllergyInput.trim()]);
    setNewAllergyInput('');
  };

  const handleRemoveAllergy = (index: number) => {
    setAllergies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddChronic = () => {
    if (!newChronicInput.trim()) return;
    setChronicConditions((prev) => [...prev, newChronicInput.trim()]);
    setNewChronicInput('');
  };

  const handleRemoveChronic = (index: number) => {
    setChronicConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      age,
      bloodType,
      emergencyContact,
      notes,
      allergies,
      chronicConditions,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div
        id="modal-edit-base-profile"
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-white shadow-xs border border-stone-200 flex items-center justify-center text-xl">
              {profile.avatar}
            </span>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                编辑【{profile.name}】基础档案
              </h3>
              <p className="text-[11px] text-stone-500">
                家庭成员均可协同维护与补充基础信息与照护习惯
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          {/* 基本信息行 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                当前年龄 / 生长阶段
              </label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="例如: 72岁 / 2岁3个月"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                血型与Rh分型
              </label>
              <input
                type="text"
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                placeholder="例如: O型 / B型 RH阳性"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-white"
              />
            </div>
          </div>

          {/* 紧急联系人 */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-stone-400" />
              <span>紧急联系人及电话</span>
            </label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="例如: 李建国 138-0013-8002 / 李婷 138-0013-8001"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-white"
              required
            />
          </div>

          {/* 过敏史维护 */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-stone-700 flex items-center justify-between">
              <span className="flex items-center gap-1 text-rose-700">
                <AlertCircle className="w-3 h-3 text-rose-500" />
                <span>过敏史与用药禁忌</span>
              </span>
              <span className="text-[10px] text-stone-400">至关重要，陪诊与看护必须核验</span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={newAllergyInput}
                onChange={(e) => setNewAllergyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAllergy();
                  }
                }}
                placeholder="输入过敏源(如: 青霉素、磺胺、牛奶蛋白)后点添加"
                className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={handleAddAllergy}
                className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {allergies.length === 0 ? (
                <span className="text-stone-400 text-[11px] italic">暂无记录过敏史</span>
              ) : (
                allergies.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(idx)}
                      className="hover:text-rose-950 text-rose-400 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* 慢性病与既往病史 */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-stone-700 flex items-center justify-between">
              <span className="flex items-center gap-1 text-amber-700">
                <Heart className="w-3 h-3 text-amber-500" />
                <span>慢性病史 / 既往手术 / 关注体征</span>
              </span>
              <span className="text-[10px] text-stone-400">如高血压、冠脉支架、近视初筛等</span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={newChronicInput}
                onChange={(e) => setNewChronicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChronic();
                  }
                }}
                placeholder="输入慢病或关注体征后点添加"
                className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={handleAddChronic}
                className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 rounded-xl font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {chronicConditions.length === 0 ? (
                <span className="text-stone-400 text-[11px] italic">暂无已知慢病记录</span>
              ) : (
                chronicConditions.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveChronic(idx)}
                      className="hover:text-amber-950 text-amber-400 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* 生活习惯与照护重点备忘 */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3 text-stone-400" />
              <span>日常生活习惯、作息与照料注意事项</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="例如：每日早8点/晚8点测血压；午后13点午睡；少盐少油等饮食照料偏好..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 resize-none bg-white"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold transition"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>保存基础档案</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
