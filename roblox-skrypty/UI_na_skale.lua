-- UI NA SKALĘ: zamienia Offset (piksele) na Scale (procent ekranu),
-- żeby UI wyglądało tak samo na komputerze i na telefonie.
-- 1. W Explorerze zaznacz swój ScreenGui (albo jedną ramkę).
-- 2. Wklej to do Command Bar (View -> Command Bar) i naciśnij Enter.
-- Coś nie tak? Ctrl+Z cofa wszystko naraz.

local Selection = game:GetService("Selection")
local ChangeHistory = game:GetService("ChangeHistoryService")

local zmienione = 0

local function naSkale(obj)
	local rodzic = obj.Parent
	if not (rodzic and rodzic:IsA("GuiBase2d")) then return end
	local r = rodzic.AbsoluteSize
	if rodzic:IsA("ScrollingFrame") then r = rodzic.AbsoluteCanvasSize end
	if r.X == 0 or r.Y == 0 then return end

	-- proporcje obrazka zapamiętane przed zmianą, żeby ikonki się nie rozciągały
	local stare = obj.AbsoluteSize
	local p, s = obj.Position, obj.Size
	obj.Position = UDim2.fromScale(p.X.Scale + p.X.Offset / r.X, p.Y.Scale + p.Y.Offset / r.Y)
	obj.Size = UDim2.fromScale(s.X.Scale + s.X.Offset / r.X, s.Y.Scale + s.Y.Offset / r.Y)

	if (obj:IsA("ImageLabel") or obj:IsA("ImageButton")) and stare.Y > 0
		and not obj:FindFirstChildOfClass("UIAspectRatioConstraint") then
		local proporcje = Instance.new("UIAspectRatioConstraint")
		proporcje.AspectRatio = stare.X / stare.Y
		proporcje.Parent = obj
	end
	zmienione = zmienione + 1
end

pcall(function() ChangeHistory:SetWaypoint("Przed UI na skalę") end)
for _, wybrany in Selection:Get() do
	if wybrany:IsA("GuiObject") then naSkale(wybrany) end
	for _, obj in wybrany:GetDescendants() do
		if obj:IsA("GuiObject") then naSkale(obj) end
	end
end
pcall(function() ChangeHistory:SetWaypoint("UI na skalę") end)
print("Gotowe! Zamieniono na Scale: " .. zmienione .. " elementów")
