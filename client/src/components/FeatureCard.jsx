export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-[#f5f5dc] text-[#ffa500] font-bold p-8 rounded-xl shadow hover:scale-[1.02] transition min-h-[300px] flex flex-col justify-start">
      <img src={icon} alt={title} className="w-12 mb-4" />
      <h3 className="text-xl mb-3">{title}</h3>
      <p className="text-base font-bold text-[#ffa500]">{description}</p>
    </div>
  );
}
