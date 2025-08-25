import cattlelog_for_chrome from "@public/cattlelog-for-chrome.png";

export default function Header() {
    return (
        <div className="flex items-center gap-3 p-4 bg-primary">
            <img src={cattlelog_for_chrome} alt="Cattlelog for Chrome" className="w-32 h-12 object-contain" />
        </div>
    );
}
