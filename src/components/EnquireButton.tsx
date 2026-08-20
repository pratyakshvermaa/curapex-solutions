"use client";

import { useState, type ReactNode } from "react";
import EnquiryModal from "./EnquiryModal";

type EnquireButtonProps = {
  medicineName: string;
  price?: string | null;
  className?: string;
  children?: ReactNode;
};

export default function EnquireButton({
  medicineName,
  price,
  className,
  children = "Enquire Now",
}: EnquireButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          "bg-teal px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-deep"
        }
      >
        {children}
      </button>
      <EnquiryModal
        open={open}
        onClose={() => setOpen(false)}
        medicineName={medicineName}
        price={price}
      />
    </>
  );
}
