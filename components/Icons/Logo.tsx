import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/cursor-community-avatar.png"
        alt="Cursor Kenya Logo"
        width={250}
        height={250}
        priority
        className="rounded-lg"
      />
    </div>
  );
}
