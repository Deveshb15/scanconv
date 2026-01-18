"use client";

import { presets, Preset } from "@/lib/scan-effects/types";

interface PresetSelectorProps {
  selectedPreset: string;
  onPresetSelect: (preset: Preset) => void;
  disabled?: boolean;
  previewImages?: Record<string, string>; // preset id -> data URL
}

export function PresetSelector({
  selectedPreset,
  onPresetSelect,
  disabled,
  previewImages,
}: PresetSelectorProps) {
  return (
    <div className="w-full">
      <p className="mb-4 text-center text-lg font-medium text-gray-700">
        Choose your scan style:
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onPresetSelect(preset)}
            disabled={disabled}
            className={`
              group relative overflow-hidden rounded-xl p-4 text-center
              transition-all duration-300 ease-out
              ${
                selectedPreset === preset.id
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200 scale-105"
                  : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:scale-102"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {/* Animated background shimmer on hover */}
            <div
              className={`
                absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                -translate-x-full group-hover:translate-x-full transition-transform duration-700
                ${selectedPreset === preset.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
              `}
            />

            <div className="relative">
              {/* Emoji with bounce animation on select */}
              <div
                className={`
                  text-3xl mb-2 transition-transform duration-300
                  ${selectedPreset === preset.id ? "animate-bounce-once" : "group-hover:scale-110"}
                `}
              >
                {preset.emoji}
              </div>

              <p className="font-semibold text-sm">{preset.name}</p>

              {/* Thumbnail preview */}
              {previewImages?.[preset.id] && (
                <div className="mt-2 aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewImages[preset.id]}
                    alt={`${preset.name} preview`}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Description tooltip on hover */}
              <div
                className={`
                  absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap
                  rounded-lg bg-gray-900 px-3 py-1 text-xs text-white
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  pointer-events-none z-10
                  ${selectedPreset === preset.id ? "hidden" : ""}
                `}
              >
                {preset.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
