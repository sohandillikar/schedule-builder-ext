import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";

const Popup = () => (
	<TooltipProvider delayDuration={0}>
		<Index />
	</TooltipProvider>
);

export default Popup;