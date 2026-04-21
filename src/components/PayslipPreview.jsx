import { Fragment } from 'react';
import { formatRupiahOrDash } from '../utils/PayrollCalculator';

const boxedTextClass = 'relative -translate-y-[2.5px] leading-none';

const employeeRows = [
  ['Nama Karyawan', 'name'],
  ['ID Karyawan', 'id'],
  ['Jabatan', 'position'],
  ['Departemen', 'department'],
  ['PTKP', 'ptkp'],
];

function ValuePill({ value, showValue, tone }) {
  const toneClass =
    tone === 'income'
      ? 'text-[#5d7a2c]'
      : 'text-[#9a4d4d]';

  return (
    <div className={`flex h-[28px] items-center justify-between px-1 text-[14px] ${toneClass}`}>
      <span className={boxedTextClass}>Rp.</span>
      <span className={boxedTextClass}>{showValue ? formatRupiahOrDash(value, true).replace('Rp. ', '') : '-'}</span>
    </div>
  );
}

export default function PayslipPreview({ formData, logoSettings, totals, enabledFields, customItems, previewRef }) {
  const period = [formData.periodMonth, formData.periodYear].filter(Boolean).join(' ') || '-';
  const previewLogoOffsetX = Math.max(logoSettings.offsetX, -8);

  const incomeRows = [
    ['Gaji Pokok', formData.pendapatan.gajiPokok, enabledFields.pendapatan.gajiPokok],
    ['T. Jabatan', formData.pendapatan.tunjanganJabatan, enabledFields.pendapatan.tunjanganJabatan],
    ['T. Konsumsi', formData.pendapatan.tunjanganKonsumsi, enabledFields.pendapatan.tunjanganKonsumsi],
    ['T. Transport', formData.pendapatan.tunjanganTransport, enabledFields.pendapatan.tunjanganTransport],
    ...customItems.pendapatan.map((item) => [item.label, item.value, item.value !== '', item.id]),
  ];

  const deductionRows = [
    ['PPH21', formData.potongan.pph21, enabledFields.potongan.pph21],
    ['BPJS Kes', formData.potongan.bpjsKesehatan, enabledFields.potongan.bpjsKesehatan],
    ['BPJSTK', formData.potongan.bpjsKetenagakerjaan, enabledFields.potongan.bpjsKetenagakerjaan],
    ['Absen', formData.potongan.absen, enabledFields.potongan.absen],
    ...customItems.potongan.map((item) => [item.label, item.value, item.value !== '', item.id]),
  ];

  return (
    <div className="fixed -left-[99999px] top-0">
      <div
        ref={previewRef}
        className="relative h-[1123px] w-[794px] overflow-hidden bg-white px-[54px] py-[42px] font-['Segoe_UI',sans-serif] text-[#3a3a3a]"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-[86px] w-[250px] items-center overflow-hidden pl-[10px]">
            {formData.logoPreview ? (
              <img
                src={formData.logoPreview}
                alt="Logo perusahaan"
                className="max-h-[74px] max-w-none object-contain"
                style={{ transform: `translateX(${previewLogoOffsetX}px) scale(${logoSettings.scale})`, transformOrigin: 'left center' }}
              />
            ) : null}
          </div>

          <div className="pt-1 text-right">
            <h2 className="text-[48px] font-semibold leading-none tracking-[-0.03em] text-[#343434]">Slip Gaji</h2>
            <div className="mt-3 flex items-center justify-end gap-3 text-[17px] text-[#606060]">
              <span>Periode Gaji :</span>
              <div className="flex h-[30px] items-center px-2 text-[#3d3d3d]">
                <span className="leading-none">{period}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex h-[30px] w-[686px] items-center px-2 text-[19px] leading-none text-[#444444]">
          <span>{formData.companyName || '-'}</span>
        </div>

        <section className="mt-11">
          <h3 className="text-[18px] font-semibold text-[#3c3c3c]">Data Karyawan</h3>
          <div className="mt-3 grid grid-cols-[160px_346px] gap-x-[18px] gap-y-1">
            {employeeRows.map(([label, key]) => (
              <Fragment key={key}>
                <div className="flex h-[28px] items-center text-[14px] leading-none text-[#a4a4a4]">
                  <span className="relative -top-px">{label}</span>
                </div>
                <div className="flex h-[28px] items-center px-2 text-[14px] leading-none text-[#484848]">
                  <span>{formData.employee[key] || '-'}</span>
                </div>
              </Fragment>
            ))}
          </div>
        </section>

        <section className="mt-11 grid grid-cols-2 gap-x-7">
          <div>
            <h3 className="text-[18px] font-semibold text-[#3c3c3c]">Pendapatan</h3>
            <div className="mt-4 space-y-[8px]">
              {incomeRows.slice(0, 5).map(([label, value, showValue, id]) => (
                <div key={id || label} className="grid grid-cols-[96px_138px] items-center gap-x-3">
                  <div className="flex h-[28px] items-center text-[14px] leading-none text-[#a2a2a2]">
                    <span>{label}</span>
                  </div>
                  <ValuePill value={value} showValue={showValue} tone="income" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[18px] font-semibold text-[#3c3c3c]">Potongan</h3>
            <div className="mt-4 space-y-[8px]">
              {deductionRows.slice(0, 5).map(([label, value, showValue, id]) => (
                <div key={id || label} className="grid grid-cols-[96px_138px] items-center gap-x-3">
                  <div className="flex h-[28px] items-center text-[14px] leading-none text-[#a2a2a2]">
                    <span>{label}</span>
                  </div>
                  <ValuePill value={value} showValue={showValue} tone="deduction" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-9 grid grid-cols-2 gap-x-7">
          <div className="flex h-[34px] items-center rounded-[8px] bg-[#dff3ba] px-3 text-[14px] leading-none text-[#3f4d28]">
            <div className="flex w-full items-center justify-between">
              <span className={boxedTextClass}>Total Pendapatan :</span>
              <span className={boxedTextClass}>{formatRupiahOrDash(totals.totalPendapatan, totals.hasPendapatanValue)}</span>
            </div>
          </div>
          <div className="flex h-[34px] items-center rounded-[8px] bg-[#f3c3c3] px-3 text-[14px] leading-none text-[#6e3737]">
            <div className="flex w-full items-center justify-between">
              <span className={boxedTextClass}>Total Potongan :</span>
              <span className={boxedTextClass}>{formatRupiahOrDash(totals.totalPotongan, totals.hasPotonganValue)}</span>
            </div>
          </div>
        </section>

        <section className="absolute bottom-[44px] left-[54px] right-[54px]">
          <div className="mb-10 flex justify-end">
            <div className="w-[276px] rounded-[18px] border-[3px] border-[#3b3b3b] px-4 py-5 text-center text-[#3b3b3b]">
              <div className="text-[16px] font-medium leading-none tracking-[0.04em] text-[#6a6a6a]">
                <span className={boxedTextClass}>TAKE HOME PAY</span>
              </div>
              <div className="mt-5 text-[28px] font-semibold leading-none">
                <span className={`inline-block ${boxedTextClass}`}>{formatRupiahOrDash(totals.takeHomePay, totals.hasTakeHomePay)}</span>
              </div>
            </div>
          </div>

          <footer className="grid grid-cols-3 gap-x-7">
            {[
              ['Dibuat Oleh', formData.approval.createdBy],
              ['Disetujui Oleh', formData.approval.approvedBy],
              ['Diterima Oleh', formData.approval.receivedBy],
            ].map(([title, value]) => (
              <div key={title}>
                <div className="text-[15px] font-medium text-[#363636]">{title} :</div>
                <div className="mt-16 space-y-2">
                  <div className="flex h-[24px] items-center px-1 text-[13px] leading-none text-[#777777]">
                    <span>{value.name || '-'}</span>
                  </div>
                  <div className="flex h-[24px] items-center px-1 text-[13px] leading-none text-[#777777]">
                    <span>{value.position || '-'}</span>
                  </div>
                </div>
              </div>
            ))}
          </footer>
        </section>
      </div>
    </div>
  );
}
