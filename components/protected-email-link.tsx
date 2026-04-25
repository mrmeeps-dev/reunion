'use client';

type ProtectedEmailLinkProps = {
  className?: string;
  subject?: string;
  children: React.ReactNode;
  user: string;
  domain: string;
};

export function ProtectedEmailLink({ className, subject, children, user, domain }: ProtectedEmailLinkProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const email = `${user}@${domain}`;
    const subjectParam = subject ? `?subject=${encodeURIComponent(subject)}` : '';
    window.location.href = `mailto:${email}${subjectParam}`;
  };

  return (
    <a href="#contact" onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
