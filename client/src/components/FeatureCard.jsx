export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-[#f5f5dc] text-[#ffa500] font-bold p-4 md:p-8 rounded-xl shadow hover:scale-[1.02] transition min-h-[200px] md:min-h-[300px] flex flex-col justify-start">
      <img src={icon} alt={title} className="w-8 md:w-12 mb-2 md:mb-4" />
      <h3 className="text-sm md:text-xl mb-1 md:mb-3 leading-tight">{title}</h3>
      <p className="text-xs md:text-base font-bold text-[#ffa500]/80 leading-snug">{description}</p>
    </div>
  );
}
