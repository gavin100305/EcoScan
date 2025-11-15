import Navigation from '../components/Landing/Navigation';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import Testimonials from '../components/Landing/Testimonials';
import CTA from '../components/Landing/CTA';
import Footer from '../components/Landing/Footer';

const testimonials = [
  {
    author: {
      name: "Sarah Martinez",
      handle: "@saraheco",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "EcoScan has completely changed how I shop. Now I can make informed decisions about the environmental impact of every product I buy.",
  },
  {
    author: {
      name: "James Chen",
      handle: "@jamesgreen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "The AI recognition is incredibly accurate. I love being able to see the carbon footprint and recyclability info instantly.",
  },
  {
    author: {
      name: "Maya Patel",
      handle: "@mayasustain",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "This app makes sustainable living so much easier. The alternative suggestions feature helps me find eco-friendly options I didn't know existed.",
  },
  {
    author: {
      name: "Alex Thompson",
      handle: "@alexzero",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "As someone trying to reduce my environmental impact, EcoScan is an invaluable tool. The detailed material breakdowns are so helpful.",
  },
  {
    author: {
      name: "Lisa Wong",
      handle: "@lisaearth",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    text: "I've been recommending EcoScan to everyone I know. It's made me much more conscious about my purchasing decisions.",
  }
];

export default function Landing() {
  return (
    <div>
      <Navigation />
      <Hero />
      <Features />
      <Testimonials 
        title="Trusted by eco-conscious consumers worldwide"
        description="Join thousands of users who are making sustainable choices every day with EcoScan"
        testimonials={testimonials}
      />
      <CTA />
      <Footer />
    </div>
  );
}
