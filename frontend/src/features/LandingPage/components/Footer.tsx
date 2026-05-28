export default function Footer() {
  return (
    <footer className="w-full py-16 px-8 md:px-16 lg:px-24 bg-white border-t border-[var(--notebook-border)] relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-serif text-2xl text-[var(--notebook-text-primary)] tracking-tight">
            Inquisitive
          </span>
          <p className="text-[13px] text-[var(--notebook-text-muted)] font-normal font-sans">
            &copy; {new Date().getFullYear()} Inquisitive AI. Built for the
            modern mind.
          </p>
        </div>

        <div className="flex gap-8 text-[13.5px] font-medium text-[var(--notebook-text-secondary)]">
          <a className="hover:text-[var(--notebook-text-primary)] cursor-pointer transition-colors">
            Privacy
          </a>
          <a className="hover:text-[var(--notebook-text-primary)] cursor-pointer transition-colors">
            Terms of Service
          </a>
          <a
            className="hover:text-[var(--notebook-text-primary)] cursor-pointer transition-colors"
            href="/app"
          >
            Go to App
          </a>
        </div>
      </div>
    </footer>
  );
}
