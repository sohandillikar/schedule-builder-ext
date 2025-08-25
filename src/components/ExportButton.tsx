import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExportButton() {
	const handleExport = () => {
		// TODO: Implement calendar export functionality
		console.log("Export to calendar clicked");
	};

	return (
		<div className="bg-background mt-4">
			<Button 
			onClick={handleExport}
			className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-subheading"
			size="lg">
				<Calendar className="w-4 h-4 mr-2" />
				Export to Calendar
			</Button>
		</div>
	);
};
