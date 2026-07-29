import ThemeToggle from './ThemeToggle';

/** @deprecated Floating toggle — theme control is now in the header */
export default function DarkPageThemeToggle() {
  return (
    <div className="fixed bottom-6 right-6 z-[60] max-sm:bottom-4 max-sm:right-4">
      <ThemeToggle variant="standalone" />
    </div>
  );
}
