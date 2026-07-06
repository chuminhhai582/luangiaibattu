import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Bát Tự AI</h1>
      <p className="text-lg mb-8 text-center max-w-2xl">
        Hệ thống đang trong quá trình phát triển (Phase 1: Khởi tạo & Cấu hình).
        <br />
        Các thành phần Database schema, Timezone data và Core Types đã được setup.
      </p>
      
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/lap-la-so">Lập Lá Số Ngay</Link>
        </Button>
      </div>
    </main>
  );
}
