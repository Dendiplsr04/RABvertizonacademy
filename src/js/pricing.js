// Pricing Page - Export to Excel
const packageData = {
  standard: { name: 'Standard Package', price: 30900000, components: { frontend: 7200000, backend: 10500000, admin: 5000000, member: 2800000, testing: 2200000, management: 3200000 } },
  premium: { name: 'Premium Package', price: 35000000, components: { frontend: 7500000, backend: 11250000, admin: 5500000, member: 3000000, testing: 2500000, management: 5250000 } }
};
let currentPackage = 'premium';
function formatRupiah(number) { return 'Rp ' + number.toLocaleString('id-ID'); }
function exportToExcel() {
  const data = packageData[currentPackage];
  const today = new Date();
  const tanggalCetak = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const dp = data.price * 0.3;
  const progress = data.price * 0.4;
  const final = data.price * 0.3;
  const subtotal = data.price - data.components.management;
  const htmlContent = <html><head><meta charset="UTF-8"><style>body{font-family:Calibri}table{border-collapse:collapse;width:100%}td,th{border:1px solid #000;padding:8px}.header{background-color:#8b5cf6;color:white;font-weight:bold}.section{background-color:#8b5cf6;color:white;font-weight:bold}.total{background-color:#f3e8ff;font-weight:bold}.price{text-align:right}</style></head><body><table><tr><td colspan="4" style="font-size:14pt;font-weight:bold;text-align:center">RENCANA ANGGARAN BIAYA (RAB)</td></tr><tr><td colspan="4" style="font-size:12pt;text-align:center">Website & Aplikasi Top Up Game - Length{data.name}</td></tr><tr><td colspan="4"></td></tr><tr><td><b>Tanggal:</b></td><td></td><td><b>Paket:</b></td><td></td></tr></table><table><tr class="header"><td>NO</td><td>KOMPONEN</td><td>DESKRIPSI</td><td class="price">HARGA</td></tr><tr class="section"><td>1</td><td colspan="2">FRONTEND DEVELOPMENT</td><td class="price"></td></tr><tr class="section"><td>2</td><td colspan="2">BACKEND DEVELOPMENT</td><td class="price"></td></tr><tr class="section"><td>3</td><td colspan="2">ADMIN DASHBOARD</td><td class="price"></td></tr><tr class="section"><td>4</td><td colspan="2">MEMBER SYSTEM</td><td class="price"></td></tr><tr class="section"><td>5</td><td colspan="2">TESTING & DEPLOYMENT</td><td class="price"></td></tr><tr class="section"><td>6</td><td colspan="2">PROJECT MANAGEMENT</td><td class="price"></td></tr><tr class="total"><td colspan="2"><b>TOTAL INVESTMENT</b></td><td></td><td class="price"><b></b></td></tr></table></body></html>;
  const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const filename = RAB_Website_TopUp_Game_Length{currentPackage}_Length{tanggalCetak.replace(/ /g, '_')}.xls;
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
document.addEventListener('DOMContentLoaded', () => {
  selectPackage('premium');
});
