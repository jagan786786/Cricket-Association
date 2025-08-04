import { Route } from "react-router-dom";
import Index from "../pages/Index";
import Services from "../pages/Services";
import Membership from "../pages/Membership";
import Tournaments from "../pages/Tournaments";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import RegisterForm from "@/pages/RegisterForm";

const userRoutes = (
  <>
    <Route path="/" element={<Index />} />
    <Route path="/services" element={<Services />} />
    <Route path="/membership" element={<Membership />} />
    <Route path="/tournaments" element={<Tournaments />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route
      path="/register/:menuItemName/:instanceId"
      element={<RegisterForm />}
    />

    <Route path="*" element={<NotFound />} />
  </>
);

export default userRoutes;
