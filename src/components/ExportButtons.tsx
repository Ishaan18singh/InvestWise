import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function ExportButtons() {
  const handlePDFExport = async () => {
    const chartArea = document.getElementById('export-area');
    if (!chartArea) return;

    const canvas = await html2canvas(chartArea);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('investment-summary.pdf');
  };

  const handleCSVExport = () => {
    const rows = [["Name", "Type", "Invested", "Returns", "Maturity"]];
    const resultRows = JSON.parse(localStorage.getItem('investmentResults') || "[]");
    
    resultRows.forEach((row: any) => {
      rows.push([
        row.name,
        row.type,
        row.totalInvested,
        row.totalReturns,
        row.maturityAmount
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + 
      rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "investment_summary.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="flex gap-4 mt-4">
      <button onClick={handlePDFExport} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
        Export PDF
      </button>
      <button onClick={handleCSVExport} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow">
        Export CSV
      </button>
    </div>
  );
}

