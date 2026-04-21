export const PTKP_OPTIONS = ['TK/0', 'TK/1', 'TK/2', 'TK/3', 'K/0', 'K/1', 'K/2', 'K/3'];

export const parseRupiahInput = (value) => Number(String(value || '').replace(/\D/g, '')) || 0;

export const formatNumberInput = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) {
    return '';
  }

  return Number(digits).toLocaleString('id-ID');
};

export const formatRupiah = (value) => {
  const numericValue = parseRupiahInput(value);
  return `Rp. ${numericValue.toLocaleString('id-ID')}`;
};

export const formatRupiahOrDash = (value, shouldShow) => {
  if (!shouldShow) {
    return '-';
  }

  return formatRupiah(value);
};

export const calculatePayroll = (payroll, enabledFields, customItems = { pendapatan: [], potongan: [] }) => {
  const incomeEntries = Object.entries(payroll.pendapatan).filter(
    ([key]) => enabledFields.pendapatan[key],
  );
  const deductionEntries = Object.entries(payroll.potongan).filter(
    ([key]) => enabledFields.potongan[key],
  );
  const customIncomeTotal = (customItems.pendapatan || []).reduce(
    (sum, item) => sum + parseRupiahInput(item.value),
    0,
  );
  const customDeductionTotal = (customItems.potongan || []).reduce(
    (sum, item) => sum + parseRupiahInput(item.value),
    0,
  );

  const totalPendapatan =
    incomeEntries.reduce((sum, [, value]) => sum + parseRupiahInput(value), 0) + customIncomeTotal;
  const totalPotongan =
    deductionEntries.reduce((sum, [, value]) => sum + parseRupiahInput(value), 0) + customDeductionTotal;
  const hasPendapatanValue =
    incomeEntries.some(([, value]) => value !== '') || (customItems.pendapatan || []).some((item) => item.value !== '');
  const hasPotonganValue =
    deductionEntries.some(([, value]) => value !== '') || (customItems.potongan || []).some((item) => item.value !== '');
  const hasTakeHomePay = hasPendapatanValue || hasPotonganValue;

  return {
    totalPendapatan,
    totalPotongan,
    takeHomePay: totalPendapatan - totalPotongan,
    hasPendapatanValue,
    hasPotonganValue,
    hasTakeHomePay,
  };
};
