import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { PTKP_OPTIONS, formatNumberInput, formatRupiahOrDash } from '../utils/PayrollCalculator';

const employeeFields = [
  ['Nama Karyawan', 'name'],
  ['ID Karyawan', 'id'],
  ['Jabatan', 'position'],
  ['Departemen', 'department'],
];

const incomeFields = [
  ['Gaji Pokok', 'gajiPokok', false],
  ['Tunjangan Jabatan', 'tunjanganJabatan', true],
  ['Tunjangan Konsumsi', 'tunjanganKonsumsi', true],
  ['Tunjangan Transportasi', 'tunjanganTransport', true],
];

const deductionFields = [
  ['PPH21', 'pph21', false],
  ['BPJS Kesehatan', 'bpjsKesehatan', true],
  ['BPJS Ketenagakerjaan', 'bpjsKetenagakerjaan', true],
  ['Absen', 'absen', true],
];

const shellInputClass =
  'w-full rounded-[14px] border border-[#595959] bg-[#2f2f2f] px-4 py-[10px] text-[15px] text-[#f3f3f3] outline-none placeholder:text-[#737373] focus:border-[#8e8e8e]';

const approvalInputClass =
  'w-full rounded-[2px] border border-[#656565] bg-transparent px-3 py-[8px] text-[12px] text-[#bdbdbd] outline-none placeholder:text-[#6d6d6d]';

const sectionGridClass = 'grid grid-cols-[372px_372px] justify-between gap-10';
const rowGridClass = 'grid grid-cols-[160px_172px_28px] items-center gap-[10px]';

function UploadIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-11 w-11 text-white" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M16 23V7" strokeLinecap="round" />
      <path d="M9.5 13.5 16 7l6.5 6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 25h19" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M7.5 3.5v4M16.5 3.5v4M3.5 9h17" strokeLinecap="round" />
    </svg>
  );
}

function PlusBadge({ tone = 'green', active, onClick, ariaLabel }) {
  const toneClass = tone === 'green' ? 'border-[#90d34e] text-[#90d34e]' : 'border-[#df6666] text-[#df6666]';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[24px] w-[24px] items-center justify-center rounded-full border bg-[#ededed] text-[18px] leading-none transition ${toneClass} ${active ? 'rotate-45' : 'hover:scale-105'}`}
      aria-label={ariaLabel || (active ? 'Nonaktifkan field' : 'Aktifkan field')}
    >
      +
    </button>
  );
}

function LogoStage({ src, scale, offsetX }) {
  return (
    <div className="relative mt-3 flex h-[96px] overflow-hidden rounded-[16px] border border-[#4f4f50] bg-[#151516]">
      <div className="relative flex w-full items-center justify-center">
        <img
          src={src}
          alt="Preview logo"
          className="max-h-[78px] max-w-none object-contain transition-transform duration-150"
          style={{ transform: `translateX(${offsetX}px) scale(${scale})` }}
        />
      </div>
    </div>
  );
}

function AmountRow({ label, value, tone, isEnabled, canToggle, onToggle, onChange }) {
  const activeClass =
    tone === 'income'
      ? 'border-[#6f8b49] bg-[#4f7b25] text-[#e8f7d0]'
      : 'border-[#6d4c4c] bg-[#3d2929] text-[#f3dada]';
  const inactiveClass = 'border-[#5e5e5e] bg-[#333333] text-[#7a7a7a]';

  return (
    <div className={rowGridClass}>
      <label className="pr-2 text-[18px] leading-[1.35] text-[#7d7d7d] md:text-[20px]">{label}</label>
      <div className={`flex items-center justify-between rounded-[12px] border px-3 py-[7px] ${isEnabled ? activeClass : inactiveClass}`}>
        <span className="text-[18px]">Rp.</span>
        <input
          type="text"
          inputMode="numeric"
          value={formatNumberInput(value)}
          onChange={onChange}
          disabled={!isEnabled}
          className="w-[88px] bg-transparent text-right text-[18px] outline-none disabled:cursor-not-allowed"
          placeholder="-"
        />
      </div>
      {canToggle ? (
        <PlusBadge
          tone={tone === 'income' ? 'green' : 'red'}
          active={isEnabled}
          onClick={onToggle}
          ariaLabel={isEnabled ? 'Nonaktifkan field' : 'Aktifkan field'}
        />
      ) : (
        <div />
      )}
    </div>
  );
}

function CustomDraftRow({ draft, tone, onLabelChange, onAmountChange, onSubmit }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={rowGridClass}>
      <input className={shellInputClass} value={draft.label} onChange={onLabelChange} onKeyDown={handleKeyDown} placeholder="Lainnya" />
      <div className="flex items-center justify-between rounded-[12px] border border-[#5e5e5e] bg-[#333333] px-3 py-[7px] text-[#d8d8d8]">
        <span className="text-[18px] text-[#8b8b8b]">Rp.</span>
        <input
          type="text"
          inputMode="numeric"
          value={formatNumberInput(draft.value)}
          onChange={onAmountChange}
          onKeyDown={handleKeyDown}
          className="w-[88px] bg-transparent text-right text-[18px] text-[#e5e5e5] outline-none"
          placeholder="-"
        />
      </div>
      <PlusBadge tone={tone === 'income' ? 'green' : 'red'} active={false} onClick={onSubmit} ariaLabel="Tambah item lainnya" />
    </div>
  );
}

function CustomItemRow({ item, tone, onValueChange, onRemove }) {
  const activeClass =
    tone === 'income'
      ? 'border-[#6f8b49] bg-[#4f7b25] text-[#e8f7d0]'
      : 'border-[#6d4c4c] bg-[#3d2929] text-[#f3dada]';

  return (
    <div className={rowGridClass}>
      <div className="w-full break-words pr-2 text-[18px] leading-[1.35] text-[#7d7d7d] md:text-[20px]">{item.label}</div>
      <div className={`flex items-center justify-between rounded-[12px] border px-3 py-[7px] ${activeClass}`}>
        <span className="text-[18px]">Rp.</span>
        <input
          type="text"
          inputMode="numeric"
          value={formatNumberInput(item.value)}
          onChange={onValueChange}
          className="w-[88px] bg-transparent text-right text-[18px] outline-none"
          placeholder="-"
        />
      </div>
      <PlusBadge tone={tone === 'income' ? 'green' : 'red'} active onClick={onRemove} ariaLabel="Hapus item lainnya" />
    </div>
  );
}

function ApprovalBlock({ title, value, onFieldChange, readOnly = false, helperText = '' }) {
  return (
    <div>
      <h3 className="text-[17px] font-medium text-[#d8d8d8]">{title} :</h3>
      <div className="mt-4 space-y-3">
        <input
          className={`${approvalInputClass} ${readOnly ? 'cursor-not-allowed border-[#4d4d4d] text-[#8e8e8e]' : ''}`}
          value={value.name}
          onChange={(event) => onFieldChange('name', event.target.value)}
          placeholder="Nama"
          readOnly={readOnly}
        />
        <input
          className={`${approvalInputClass} ${readOnly ? 'cursor-not-allowed border-[#4d4d4d] text-[#8e8e8e]' : ''}`}
          value={value.position}
          onChange={(event) => onFieldChange('position', event.target.value)}
          placeholder="Jabatan"
          readOnly={readOnly}
        />
        {helperText ? <p className="text-[11px] text-[#6d6d6d]">{helperText}</p> : null}
      </div>
    </div>
  );
}

export default function FormInput({
  formData,
  logoDraft,
  enabledFields,
  customDrafts,
  customItems,
  onFieldChange,
  onLogoChange,
  onLogoDraftChange,
  onSaveLogo,
  onPeriodChange,
  onToggleField,
  onCustomDraftChange,
  onAddCustomItem,
  onCustomItemChange,
  onRemoveCustomItem,
  totals,
}) {
  const monthInputRef = useRef(null);
  const [mobileScale, setMobileScale] = useState(1);

  const selectedMonthValue = useMemo(() => {
    if (!formData.periodMonth || !formData.periodYear) {
      return '';
    }

    const monthIndex = new Date(`${formData.periodMonth} 1, ${formData.periodYear}`).getMonth() + 1;
    return `${formData.periodYear}-${String(monthIndex).padStart(2, '0')}`;
  }, [formData.periodMonth, formData.periodYear]);

  useEffect(() => {
    const updateScale = () => {
      const nextScale = Math.min(1, (window.innerWidth - 24) / 928);
      setMobileScale(Number.isFinite(nextScale) ? Math.max(nextScale, 0.34) : 1);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="mx-auto w-full" style={{ minHeight: `${mobileScale * 1360}px` }}>
      <div
        className="origin-top-left"
        style={{
          width: `${928 * mobileScale}px`,
          transform: `scale(${mobileScale})`,
          transformOrigin: 'top left',
        }}
      >
        <div className="rounded-[16px] bg-gradient-to-r from-[#8E8E8E] to-[#2E67B4] p-[1.5px]">
          <div className="rounded-[13px] bg-[#0f0f10] px-[72px] pb-[72px] pt-[38px] text-[#d9d9d9]">
            <div className="text-center">
              <h1 className="text-[66px] font-medium leading-[0.95] tracking-[-0.04em] text-[#f0f0f0]">
                Slip Gaji
                <span className="block bg-gradient-to-r from-[#8E8E8E] to-[#2E67B4] bg-clip-text text-transparent">Generator</span>
              </h1>
              <div className="mx-auto mt-4 inline-flex rounded-full bg-gradient-to-r from-[#8E8E8E] to-[#2E67B4] p-px">
                <div className="rounded-full bg-[#4a4a4a] px-3 py-[3px] text-[11px] leading-none text-[#ebebeb]">Dannes Portfolio</div>
              </div>
            </div>

            <div className="mt-[64px] grid grid-cols-[228px_1fr] items-start gap-6 gap-x-[72px]">
              <div>
                <label className="flex h-[162px] cursor-pointer flex-col items-center justify-center rounded-[22px] border border-[#595959] bg-[#121213] px-4 text-center">
                  {formData.logoPreview ? (
                    <img src={formData.logoPreview} alt="Logo perusahaan" className="max-h-[92px] max-w-[150px] object-contain" />
                  ) : (
                    <>
                      <UploadIcon />
                      <div className="mt-3 text-[18px] text-[#9a9a9a]">Upload Logo Perusahaan</div>
                      <div className="mt-1 text-[12px] text-[#787878]">(JPG / PNG)</div>
                      <div className="text-[12px] text-[#787878]">Maksimal 2MB</div>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={onLogoChange} className="hidden" />
                </label>

                {formData.logoPreview ? (
                  <div className="mt-4 rounded-[18px] border border-[#3e3e40] bg-[#111112] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] uppercase tracking-[0.18em] text-[#8f8f90]">Logo Editor</p>
                      <button type="button" onClick={onSaveLogo} className="rounded-full bg-gradient-to-r from-[#8E8E8E] to-[#2E67B4] p-px">
                        <span className="block rounded-full bg-[#171718] px-4 py-1.5 text-[12px] font-medium text-[#f1f1f1]">Save</span>
                      </button>
                    </div>
                    <LogoStage src={formData.logoPreview} scale={logoDraft.scale} offsetX={logoDraft.offsetX} />
                    <div className="mt-4 space-y-3">
                      <label className="block">
                        <div className="mb-1 flex items-center justify-between text-[13px] text-[#a2a2a3]">
                          <span>Zoom</span>
                          <span>{logoDraft.scale.toFixed(2)}x</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="2.5"
                          step="0.01"
                          value={logoDraft.scale}
                          onChange={(event) => onLogoDraftChange('scale', event.target.value)}
                          className="w-full accent-[#2E67B4]"
                        />
                      </label>
                      <label className="block">
                        <div className="mb-1 flex items-center justify-between text-[13px] text-[#a2a2a3]">
                          <span>Geser Horizontal</span>
                          <span>{logoDraft.offsetX}px</span>
                        </div>
                        <input
                          type="range"
                          min="-80"
                          max="80"
                          step="1"
                          value={logoDraft.offsetX}
                          onChange={(event) => onLogoDraftChange('offsetX', event.target.value)}
                          className="w-full accent-[#8E8E8E]"
                        />
                      </label>
                      <p className="text-[12px] text-[#727274]">Klik `Save` agar posisi logo dipakai di preview dan PDF.</p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="pt-1">
                <div className="flex items-end justify-end gap-6">
                  <div className="pb-[12px] text-[28px] font-medium text-[#ededed]">Slip Gaji</div>
                </div>
                <div className="mt-1 flex items-center justify-end gap-5">
                  <div className="text-[18px] text-[#7f7f7f]">Periode Gaji :</div>
                  <button
                    type="button"
                    onClick={() => monthInputRef.current?.showPicker?.() || monthInputRef.current?.click()}
                    className="relative flex w-[240px] items-center justify-between rounded-[16px] border border-[#595959] bg-[#141415] px-5 py-[10px] text-[18px] text-[#6e6e6e]"
                  >
                    <span>{[formData.periodMonth, formData.periodYear].filter(Boolean).join(' / ') || 'Bulan / Tahun'}</span>
                    <span className="text-[#efefef]">
                      <CalendarIcon />
                    </span>
                    <input
                      ref={monthInputRef}
                      type="month"
                      value={selectedMonthValue}
                      onChange={(event) => onPeriodChange(event.target.value)}
                      className="absolute inset-0 opacity-0"
                      aria-label="Pilih periode gaji"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <input
                className={`${shellInputClass} min-h-[54px] max-w-[398px]`}
                value={formData.companyName}
                onChange={(event) => onFieldChange('root', 'companyName', event.target.value)}
                placeholder="Nama Perusahaan"
              />
            </div>

            <section className="mt-[74px]">
              <h2 className="text-[18px] font-medium text-[#d9d9d9]">Data Karyawan</h2>
              <div className="mt-6 grid grid-cols-[138px_20px_1fr] items-center gap-x-5 gap-y-4">
                {employeeFields.map(([label, key]) => (
                  <Fragment key={key}>
                    <div className="text-[18px] text-[#7b7b7b]">{label}</div>
                    <div className="text-[18px] text-[#7b7b7b]">:</div>
                    <input className={shellInputClass} value={formData.employee[key]} onChange={(event) => onFieldChange('employee', key, event.target.value)} />
                  </Fragment>
                ))}
                <div className="text-[18px] text-[#7b7b7b]">PTKP</div>
                <div className="text-[18px] text-[#7b7b7b]">:</div>
                <div className="relative">
                  <select className={`${shellInputClass} appearance-none pr-12`} value={formData.employee.ptkp} onChange={(event) => onFieldChange('employee', 'ptkp', event.target.value)}>
                    {PTKP_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[16px] text-[#ededed]">▼</div>
                </div>
              </div>
            </section>

            <section className={`mt-[68px] ${sectionGridClass}`}>
              <div className="w-full">
                <h2 className="text-[18px] font-medium text-[#d9d9d9]">Pendapatan</h2>
                <div className="mt-7 space-y-4">
                  {incomeFields.map(([label, key, canToggle]) => (
                    <AmountRow
                      key={key}
                      label={label}
                      value={formData.pendapatan[key]}
                      tone="income"
                      isEnabled={enabledFields.pendapatan[key]}
                      canToggle={canToggle}
                      onToggle={() => onToggleField('pendapatan', key)}
                      onChange={(event) => onFieldChange('pendapatan', key, event.target.value)}
                    />
                  ))}
                  {customItems.pendapatan.map((item) => (
                    <CustomItemRow
                      key={item.id}
                      item={item}
                      tone="income"
                      onValueChange={(event) => onCustomItemChange('pendapatan', item.id, 'value', event.target.value)}
                      onRemove={() => onRemoveCustomItem('pendapatan', item.id)}
                    />
                  ))}
                  <CustomDraftRow
                    draft={customDrafts.pendapatan}
                    tone="income"
                    onLabelChange={(event) => onCustomDraftChange('pendapatan', 'label', event.target.value)}
                    onAmountChange={(event) => onCustomDraftChange('pendapatan', 'value', event.target.value)}
                    onSubmit={() => onAddCustomItem('pendapatan')}
                  />
                </div>
              </div>

              <div className="w-full">
                <h2 className="text-[18px] font-medium text-[#d9d9d9]">Potongan</h2>
                <div className="mt-7 space-y-4">
                  {deductionFields.map(([label, key, canToggle]) => (
                    <AmountRow
                      key={key}
                      label={label}
                      value={formData.potongan[key]}
                      tone="deduction"
                      isEnabled={enabledFields.potongan[key]}
                      canToggle={canToggle}
                      onToggle={() => onToggleField('potongan', key)}
                      onChange={(event) => onFieldChange('potongan', key, event.target.value)}
                    />
                  ))}
                  {customItems.potongan.map((item) => (
                    <CustomItemRow
                      key={item.id}
                      item={item}
                      tone="deduction"
                      onValueChange={(event) => onCustomItemChange('potongan', item.id, 'value', event.target.value)}
                      onRemove={() => onRemoveCustomItem('potongan', item.id)}
                    />
                  ))}
                  <CustomDraftRow
                    draft={customDrafts.potongan}
                    tone="deduction"
                    onLabelChange={(event) => onCustomDraftChange('potongan', 'label', event.target.value)}
                    onAmountChange={(event) => onCustomDraftChange('potongan', 'value', event.target.value)}
                    onSubmit={() => onAddCustomItem('potongan')}
                  />
                </div>
              </div>
            </section>

            <section className="mt-[34px] grid grid-cols-2 gap-4 gap-x-[18px]">
              <div className="flex h-[37px] items-center justify-between bg-[#447f1b] px-6 text-[17px] text-[#dceecf]">
                <span>Total Pendapatan :</span>
                <span>{formatRupiahOrDash(totals.totalPendapatan, totals.hasPendapatanValue)}</span>
              </div>
              <div className="flex h-[37px] items-center justify-between bg-[#442929] px-6 text-[17px] text-[#f0d5d5]">
                <span>Total Potongan :</span>
                <span>{formatRupiahOrDash(totals.totalPotongan, totals.hasPotonganValue)}</span>
              </div>
            </section>

            <section className="mt-[66px] flex justify-end">
              <div className="w-full max-w-[334px] rounded-[14px] border-2 border-[#ededed] px-9 py-8 text-center">
                <div className="text-[28px] font-medium tracking-[0.02em] text-[#dcdcdc]">TAKE HOME PAY</div>
                <div className="mt-8 text-[40px] font-semibold text-[#d9d9d9]">{formatRupiahOrDash(totals.takeHomePay, totals.hasTakeHomePay)}</div>
              </div>
            </section>

            <section className="mt-[110px] grid grid-cols-3 gap-8 gap-x-[70px]">
              <ApprovalBlock title="Dibuat Oleh" value={formData.approval.createdBy} onFieldChange={(field, value) => onFieldChange('approval.createdBy', field, value)} />
              <ApprovalBlock title="Disetujui Oleh" value={formData.approval.approvedBy} onFieldChange={(field, value) => onFieldChange('approval.approvedBy', field, value)} />
              <ApprovalBlock
                title="Diterima Oleh"
                value={formData.approval.receivedBy}
                onFieldChange={(field, value) => onFieldChange('approval.receivedBy', field, value)}
                readOnly
                helperText="Terisi otomatis dari Nama Karyawan dan Jabatan."
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
