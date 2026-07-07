"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompletion } from "@ai-sdk/react";

export default function InterpretSection({ chartId }: { chartId: string }) {
  const [loadingFree, setLoadingFree] = useState(false);
  const [freeData, setFreeData] = useState<any>(null);

  const { complete: streamFull, completion: fullReading, isLoading: isLoadingFull } = useCompletion({
    api: "/api/interpret",
  });

  const getFreeSummary = async () => {
    setLoadingFree(true);
    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chart_id: chartId, tier: "free" })
      });
      const data = await res.json();
      setFreeData(data);
    } catch (e) {
      alert("Có lỗi xảy ra");
    } finally {
      setLoadingFree(false);
    }
  };

  const getFullReading = async () => {
    // In real app, this redirects to payment or checks entitlement.
    // Here we just trigger the stream for testing.
    await streamFull("", { body: { chart_id: chartId, tier: "full" } });
  };

  return (
    <div className="space-y-6">
      {!freeData && (
        <div className="text-center py-10">
          <Button onClick={getFreeSummary} size="lg" disabled={loadingFree}>
            {loadingFree ? "Đang luận giải..." : "Xem Luận Giải Tổng Quan (Miễn phí)"}
          </Button>
        </div>
      )}

      {freeData && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle>Tổng Quan Lá Số</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-wrap">{freeData.summary?.summary_md || "Không thể tạo tóm tắt"}</p>
            <ul className="list-disc pl-5">
              {freeData.summary?.teaser_points?.map((point: string, i: number) => (
                <li key={i}>{point}</li>
              ))}
            </ul>

            <div className="bg-muted p-6 rounded-lg text-center mt-6 space-y-4">
              <h3 className="font-bold text-lg">Mở Khóa Luận Giải Chuyên Sâu</h3>
              <p className="text-sm text-muted-foreground">
                Nhận bài luận chi tiết về tính cách, sự nghiệp, tài lộc, tình duyên, 10 đại vận và lưu niên 3 năm tới.
              </p>
              <Button onClick={getFullReading} disabled={isLoadingFull}>
                {isLoadingFull ? "Đang viết bài..." : "Thanh Toán & Mở Khóa (99.000đ)"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {fullReading && (
        <Card>
          <CardHeader>
            <CardTitle>Bài Luận Chi Tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
              {fullReading}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
