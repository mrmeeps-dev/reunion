'use client';

type ProtectedPhoneLinkProps = {
  className?: string;
};

const PART_A = '520';
const PART_B = '465';
const PART_C = '8398';

export function ProtectedPhoneLink({ className }: ProtectedPhoneLinkProps) {
  const displayNumber = `${PART_A}-${PART_B}-${PART_C}`;
  const dialNumber = `${PART_A}${PART_B}${PART_C}`;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.href = `tel:+1${dialNumber}`;
  };

  return (
    <a href="#call" onClick={handleClick} className={className}>
      {displayNumber}
    </a>
  );
}
