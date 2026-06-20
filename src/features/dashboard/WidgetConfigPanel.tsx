import { X } from "lucide-react";
import { Btn, FormField, inputCls, selectCls } from "@/components/shared";
import type { DashboardWidget, DashboardWidgetType } from "@/types/pageLayout";
import { DASHBOARD_DATA_SOURCES, getDataSourceMeta } from "@/lib/dashboardDataSources";

type Props = {
  widget: DashboardWidget;
  onChange: (widget: DashboardWidget) => void;
  onClose: () => void;
};

const TYPE_OPTIONS: DashboardWidgetType[] = ["stat", "area", "bar", "pie", "list"];

export function WidgetConfigPanel({ widget, onChange, onClose }: Props) {
  const meta = getDataSourceMeta(widget.dataSource);
  const allowedTypes = meta?.widgetTypes ?? TYPE_OPTIONS;

  const updateColor = (index: number, hex: string) => {
    const colors = [...(widget.colors ?? ["#1a3a5c"])];
    colors[index] = hex;
    onChange({ ...widget, colors });
  };

  const addColor = () => {
    onChange({ ...widget, colors: [...(widget.colors ?? []), "#2563eb"] });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-card border-l border-border shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Widget settings</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <FormField label="Title">
            <input
              className={inputCls}
              value={widget.title}
              onChange={(e) => onChange({ ...widget, title: e.target.value })}
            />
          </FormField>

          <FormField label="Subtitle">
            <input
              className={inputCls}
              value={widget.subtitle ?? ""}
              onChange={(e) => onChange({ ...widget, subtitle: e.target.value || undefined })}
            />
          </FormField>

          <FormField label="Data source">
            <select
              className={selectCls}
              value={widget.dataSource}
              onChange={(e) => {
                const next = getDataSourceMeta(e.target.value);
                if (!next) return;
                onChange({
                  ...widget,
                  dataSource: next.key,
                  type: next.defaultType,
                  title: widget.title || next.defaultTitle,
                  subtitle: widget.subtitle ?? next.defaultSubtitle,
                  span: next.defaultSpan,
                  colors: next.defaultColors,
                  icon: next.defaultIcon,
                });
              }}
            >
              {DASHBOARD_DATA_SOURCES.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Chart type">
            <select
              className={selectCls}
              value={widget.type}
              onChange={(e) => onChange({ ...widget, type: e.target.value as DashboardWidgetType })}
            >
              {allowedTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Width (columns)">
            <select
              className={selectCls}
              value={widget.span}
              onChange={(e) => onChange({ ...widget, span: Number(e.target.value) as DashboardWidget["span"] })}
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} column{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </FormField>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={widget.visible}
              onChange={(e) => onChange({ ...widget, visible: e.target.checked })}
            />
            Visible
          </label>

          {widget.type !== "list" && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Colors</p>
              {(widget.colors ?? ["#1a3a5c"]).map((color, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(i, e.target.value)}
                    className="w-10 h-9 rounded border border-border cursor-pointer"
                  />
                  <input
                    className={inputCls}
                    value={color}
                    onChange={(e) => updateColor(i, e.target.value)}
                  />
                </div>
              ))}
              {(widget.type === "bar" || widget.type === "area") && widget.dataSource === "fee-trend" && (
                <Btn variant="ghost" onClick={addColor}>
                  Add series color
                </Btn>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <Btn className="w-full" onClick={onClose}>
            Done
          </Btn>
        </div>
      </aside>
    </>
  );
}
