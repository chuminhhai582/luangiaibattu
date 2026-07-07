import Link from "next/link";
import { Compass } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.04]">
      {/* Gradient line accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                <Compass className="w-4 h-4 text-primary" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Bát Tự <span className="text-gradient-gold">AI</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Hệ thống lập và luận giải lá số Bát Tự chuyên sâu, kết hợp thuật toán thiên văn chính xác với trí tuệ nhân tạo.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">Khám phá</h4>
            <div className="space-y-2.5">
              {[
                { href: "/lap-la-so", label: "Lập Lá Số" },
                { href: "/kien-thuc", label: "Kiến Thức Bát Tự" },
                { href: "/gioi-thieu", label: "Về Chúng Tôi" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">Pháp lý</h4>
            <div className="space-y-2.5">
              {[
                { href: "/chinh-sach", label: "Chính Sách Bảo Mật" },
                { href: "/dieu-khoan", label: "Điều Khoản Sử Dụng" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Bát Tự AI. Mọi bình giải mang tính tham khảo, không thay thế tư vấn chuyên gia.
          </p>
          <p className="text-xs text-muted-foreground/50">
            Powered by AI · Thuật toán thiên văn chuẩn xác
          </p>
        </div>
      </div>
    </footer>
  );
}
