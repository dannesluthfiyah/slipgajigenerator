import { useEffect, useRef, useState } from 'react';
import FormInput from './components/FormInput';
import PayslipPreview from './components/PayslipPreview';
import ExportPDF from './components/ExportPDF';
import { calculatePayroll } from './utils/PayrollCalculator';

const initialFormData = {
  logoPreview: '',
  companyName: '',
  periodMonth: '',
  periodYear: '',
  employee: {
    name: '',
    id: '',
    position: '',
    department: '',
    ptkp: 'K/0',
  },
  pendapatan: {
    gajiPokok: '',
    tunjanganJabatan: '',
    tunjanganKonsumsi: '',
    tunjanganTransport: '',
  },
  potongan: {
    pph21: '',
    bpjsKesehatan: '',
    bpjsKetenagakerjaan: '',
    absen: '',
  },
  approval: {
    createdBy: { name: '', position: '' },
    approvedBy: { name: '', position: '' },
    receivedBy: { name: '', position: '' },
  },
};

const initialEnabledFields = {
  pendapatan: {
    gajiPokok: true,
    tunjanganJabatan: false,
    tunjanganKonsumsi: false,
    tunjanganTransport: false,
  },
  potongan: {
    pph21: true,
    bpjsKesehatan: false,
    bpjsKetenagakerjaan: false,
    absen: false,
  },
};

const initialCustomDrafts = {
  pendapatan: { label: '', value: '' },
  potongan: { label: '', value: '' },
};

export default function App() {
  const [formData, setFormData] = useState(initialFormData);
  const [enabledFields, setEnabledFields] = useState(initialEnabledFields);
  const [customDrafts, setCustomDrafts] = useState(initialCustomDrafts);
  const [customItems, setCustomItems] = useState({ pendapatan: [], potongan: [] });
  const [logoDraft, setLogoDraft] = useState({ scale: 1, offsetX: 0 });
  const [logoSettings, setLogoSettings] = useState({ scale: 1, offsetX: 0 });
  const previewRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleFieldChange = (group, field, value) => {
    setFormData((current) => {
      if (group === 'root') {
        return { ...current, [field]: value };
      }

      if (group.startsWith('approval.')) {
        const [, approvalKey] = group.split('.');
        return {
          ...current,
          approval: {
            ...current.approval,
            [approvalKey]: {
              ...current.approval[approvalKey],
              [field]: value,
            },
          },
        };
      }

      if (group === 'employee') {
        return {
          ...current,
          employee: {
            ...current.employee,
            [field]: value,
          },
          approval: {
            ...current.approval,
            receivedBy: {
              ...current.approval.receivedBy,
              name: field === 'name' ? value : current.employee.name,
              position: field === 'position' ? value : current.employee.position,
            },
          },
        };
      }

      return {
        ...current,
        [group]: {
          ...current[group],
          [field]: value.replace(/\D/g, '').replace(/^0+(?=\d)/, ''),
        },
      };
    });
  };

  const handlePeriodChange = (value) => {
    if (!value) {
      setFormData((current) => ({ ...current, periodMonth: '', periodYear: '' }));
      return;
    }

    const [year] = value.split('-');
    const monthLabel = new Date(`${value}-01T00:00:00`).toLocaleString('id-ID', { month: 'long' });
    setFormData((current) => ({
      ...current,
      periodMonth: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
      periodYear: year,
    }));
  };

  const handleToggleField = (group, field) => {
    setEnabledFields((current) => {
      const nextEnabled = !current[group][field];

      if (!nextEnabled) {
        setFormData((currentForm) => ({
          ...currentForm,
          [group]: {
            ...currentForm[group],
            [field]: '',
          },
        }));
      }

      return {
        ...current,
        [group]: {
          ...current[group],
          [field]: nextEnabled,
        },
      };
    });
  };

  const handleCustomDraftChange = (group, field, value) => {
    setCustomDrafts((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [field]: field === 'value' ? value.replace(/\D/g, '').replace(/^0+(?=\d)/, '') : value,
      },
    }));
  };

  const handleAddCustomItem = (group) => {
    const draft = customDrafts[group];
    if (!draft.label.trim() || !draft.value) {
      return;
    }

    setCustomItems((current) => ({
      ...current,
      [group]: [
        ...current[group],
        {
          id: `${group}-${Date.now()}-${current[group].length}`,
          label: draft.label.trim(),
          value: draft.value,
        },
      ],
    }));

    setCustomDrafts((current) => ({
      ...current,
      [group]: { label: '', value: '' },
    }));
  };

  const handleCustomItemChange = (group, itemId, field, value) => {
    setCustomItems((current) => ({
      ...current,
      [group]: current[group].map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: field === 'value' ? value.replace(/\D/g, '').replace(/^0+(?=\d)/, '') : value,
            }
          : item,
      ),
    }));
  };

  const handleRemoveCustomItem = (group, itemId) => {
    setCustomItems((current) => ({
      ...current,
      [group]: current[group].filter((item) => item.id !== itemId),
    }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    setFormData((current) => ({ ...current, logoPreview: nextUrl }));
    setLogoDraft({ scale: 1, offsetX: 0 });
    setLogoSettings({ scale: 1, offsetX: 0 });
  };

  const handleLogoDraftChange = (field, value) => {
    setLogoDraft((current) => ({
      ...current,
      [field]: Number(value),
    }));
  };

  const handleSaveLogo = () => {
    setLogoSettings(logoDraft);
  };

  const totals = calculatePayroll(formData, enabledFields, customItems);

  return (
    <main className="min-h-screen bg-[#000000] px-4 py-6 md:px-6">
      <div className="mx-auto max-w-[900px]">
        <FormInput
          formData={formData}
          logoDraft={logoDraft}
          enabledFields={enabledFields}
          customDrafts={customDrafts}
          customItems={customItems}
          onFieldChange={handleFieldChange}
          onLogoChange={handleLogoChange}
          onLogoDraftChange={handleLogoDraftChange}
          onSaveLogo={handleSaveLogo}
          onPeriodChange={handlePeriodChange}
          onToggleField={handleToggleField}
          onCustomDraftChange={handleCustomDraftChange}
          onAddCustomItem={handleAddCustomItem}
          onCustomItemChange={handleCustomItemChange}
          onRemoveCustomItem={handleRemoveCustomItem}
          totals={totals}
        />
        <div className="mt-7 flex justify-end pr-[34px]">
          <div className="scale-[1.15] origin-right">
            <ExportPDF previewRef={previewRef} employeeName={formData.employee.name} />
          </div>
        </div>
        <PayslipPreview
          formData={formData}
          logoSettings={logoSettings}
          totals={totals}
          enabledFields={enabledFields}
          customItems={customItems}
          previewRef={previewRef}
        />
      </div>
    </main>
  );
}
