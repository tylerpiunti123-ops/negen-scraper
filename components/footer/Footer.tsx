import { navLinks } from "@/data/navigation";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-14">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 font-semibold tracking-tight text-paper-50">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-ink-600 bg-ink-900 font-mono text-xs text-accent">
                S
              </span>
              <span>SystemCore</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-mist-500">
              AI-powered systems that capture leads, respond to customers, and automate follow-up
              — built into the tools you already use.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-mist-500">Explore</p>
              <ul className="mt-3 space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-mist-400 hover:text-paper-50">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-mist-500">Get Started</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href="#demos" className="text-sm text-mist-400 hover:text-paper-50">
                    Try AI Demos
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-sm text-mist-400 hover:text-paper-50">
                    Book A Call
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-ink-800 pt-6 text-xs text-mist-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} SystemCore. All rights reserved.</p>
          <p>Demo data shown throughout this site is illustrative and not real client data.</p>
        </div>
      </Container>
    </footer>
  );
}
