export default function ExportPDF({ previewRef, employeeName }) {
  const handleExport = async () => {
    if (!previewRef.current) {
      return;
    }

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const canvas = await html2canvas(previewRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imageData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imageWidth = canvas.width;
    const imageHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imageWidth, pdfHeight / imageHeight);
    const renderWidth = imageWidth * ratio;
    const renderHeight = imageHeight * ratio;
    const offsetX = (pdfWidth - renderWidth) / 2;
    const offsetY = (pdfHeight - renderHeight) / 2;

    pdf.addImage(imageData, 'PNG', offsetX, offsetY, renderWidth, renderHeight, undefined, 'FAST');

    const safeName = (employeeName || 'Karyawan').replace(/[\\/:*?"<>|]+/g, '').trim() || 'Karyawan';
    pdf.save(`SlipGaji-${safeName}.pdf`);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex h-[44px] items-center justify-center rounded-[14px] bg-[#ededed] px-8 text-[15px] font-medium text-[#343434] transition hover:bg-white"
    >
      Download
    </button>
  );
}
