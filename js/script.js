import Color from "./color.js";
const getCSSVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue("--" + name);
const colors = Object.fromEntries(
  ["red", "tan", "offwhite"].map((name) => [name, new Color(getCSSVar(name))])
);
const redToTan = colors.red.range(colors.tan, {
  space: "lab",
  outputSpace: "srgb",
});

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const [top, center, bottom] = [0, 0.5, 1];

// prettier-ignore
const stages = [
  /*  0 */ { id: 'intro-graf1',  anchor: top,    at: top,    year: 2022  },
  /*  1 */ { id: 'hed',          anchor: center, at: center },
  /*  2 */ { id: 'intro-graf2',  anchor: center, at: center },
  /*  3 */ { id: 'intro-graf3',  anchor: top,    at: bottom, ease: false },
  /*  4 */ { id: 'intro-graf3',  anchor: center, at: 0.75,   year: 1770  },
  /*  5 */ { id: 'intro-graf4',  anchor: top,    at: bottom },
  /*  6 */ { id: 'intro-graf4',  anchor: center, at: center, year: 1900  },
  /*  7 */ { id: 'intro-graf5',  anchor: top,    at: bottom },
  /*  8 */ { id: 'intro-graf5',  anchor: center, at: 0.75,   year: 1920  },
  /*  9 */ { id: 'intro-graf6',  anchor: top,    at: bottom },
  /* 10 */ { id: 'intro-graf6',  anchor: top,    at: top,    year: 1940  },
  /* 11 */ { id: 'intro-graf7',  anchor: center, at: 0.75   },
  /* 12 */ { id: 'intro-graf7',  anchor: center, at: 0.25,   year: 1960  },
  /* 13 */ { id: 'intro-graf8',  anchor: center, at: center },
  /* 14 */ { id: 'intro-graf9',  anchor: top,    at: bottom, year: 1980  },
  /* 15 */ { id: 'intro-graf9',  anchor: center, at: center },
  /* 16 */ { id: 'intro-graf10', anchor: center, at: center, year: 2000  },
  /* 17 */ { id: 'intro-graf10', anchor: bottom, at: center },
  /* 18 */ { id: 'map-slider',   anchor: top,    at: top    },
  /* 19 */ { id: 'map-slider',   anchor: bottom, at: bottom },
  /* 20 */ { id: 'main-content', anchor: top,    at: 0.25   },
  /* 21 */ { id: 'body',         anchor: bottom, at: bottom },
]

const formatYear = (year) => {
  const s = year.toString();
  return s
    .split("")
    .map((s) => `<span>${s}</span>`)
    .join("");
};

const automations = [
  { id: "intro-maps", stages: [-1, 18] },
  { id: "first-map", stages: [-1] },
  { id: "map-1770", stages: [4] },
  { id: "map-1770-1900", stages: [4, 6] },
  { id: "map-1900", stages: [6] },
  { id: "map-1920", stages: [8] },
  { id: "map-1940", stages: [10] },
  { id: "map-1940-1980", stages: [10, 14] },
  { id: "map-1940-2000", stages: [10, 16] },
  { id: "map-1960", stages: [12] },
  { id: "map-1980", stages: [14] },
  { id: "map-1980-2000", stages: [14, 16] },
  { id: "map-2000", stages: [16] },
  { id: "year-1", stages: [2, 18] },
  { id: "year-2", stages: [2, 18] },
  { id: "map-properties", stages: [-1, 20] },
  { id: "modern-maps", stages: [18] },
];

const mapTransformsDesktop = [
  { stage: -1, scale: 2, translate: [40, -30] },
  { stage: 4, scale: 2, translate: [40, -40] },
  { stage: 6, scale: 1, translate: [40, -5] },
  { stage: 8, scale: 2, translate: [40, -30] },
  { stage: 12, scale: 1.5, translate: [40, -40] },
  { stage: 20, scale: 1, translate: [0, 0] },
];
const mapTransformsMobile = [
  { stage: -1, scale: 1, translate: [40, -20] },
  { stage: 4, scale: 2, translate: [38, -40] },
  { stage: 6, scale: 1.3, translate: [30, 10] },
  { stage: 8, scale: 2, translate: [40, -30] },
  { stage: 12, scale: 2, translate: [40, -30] },
  { stage: 14, scale: 1.5, translate: [40, -30] },
  { stage: 20, scale: 1, translate: [0, 0] },
];
const reducedMotionTransform = { scale: 0.95, translate: [40, -15] };
const formatTransform = ({ scale, translate }) =>
  `scale(${scale}) translate(${translate[0]}, ${translate[1]})`;

const onScroll = () => {
  const scroll =
    document.scrollingElement.scrollTop /
    document.scrollingElement.clientHeight;

  const stagePositions = stages.map(({ id, anchor, at }) => {
    const el = document.getElementById(id);
    const anchorPos = el.offsetTop + el.offsetHeight * anchor;
    const atPos =
      document.scrollingElement.scrollTop +
      document.scrollingElement.clientHeight * at;
    return anchorPos - atPos;
  });
  const stage = stagePositions.reduce((acc, val, i) => (val < 0 ? i : acc), -1);
  const pos = stagePositions[stage] ?? -document.scrollingElement.scrollTop;
  const frac =
    pos /
    (pos -
      (stagePositions[stage + 1] ??
        document.scrollingElement.scrollTop -
          document.scrollingElement.clientHeight));
  // magic from d3
  const easeCubic = (t) =>
    ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  const interpolate = (from, to) =>
    from +
    (to - from) * (stages[stage]?.ease === false ? frac : easeCubic(frac));
  const isMobile = window.innerWidth < 768;

  $("#debug-overlay").text(
    `Scroll: ${scroll.toFixed(2)} / Stage: ${stage} / Frac: ${(
      frac * 100
    ).toFixed(1)}% / Eased: ${interpolate(0, 100).toFixed(1)}%`
  );

  for (const { id, stages } of automations) {
    const el = document.getElementById(id);
    const nextStageIdx = stages.findIndex((s) => s > stage);
    if (nextStageIdx === -1) {
      // past end
      el.style.opacity = stages.length % 2 === 0 ? 0 : 1;
    } else {
      const isShowing = nextStageIdx % 2 === 0;
      if (stage < stages[nextStageIdx] - 1) {
        el.style.opacity = isShowing ? 0 : 1;
      } else {
        el.style.opacity = isShowing ? frac : 1 - frac;
      }
    }
  }

  const mapTransforms = isMobile ? mapTransformsMobile : mapTransformsDesktop;
  for (let i = 0; i < mapTransforms.length; i++) {
    if (prefersReducedMotion) {
      $("#map-transform-wrapper").attr(
        "transform",
        formatTransform(reducedMotionTransform)
      );
      break;
    }

    const t = mapTransforms[i];
    if (i === 0 && stage === -1) {
      // $('#map-transform-wrapper').attr('transform', `scale(${t.scale}) translate(${t.translate.join(',')})`)
      $("#map-transform-wrapper").attr("transform", formatTransform(t));
      break;
    }
    const prev = mapTransforms[i - 1];
    if (stage === t.stage - 1) {
      $("#map-transform-wrapper").attr(
        "transform",
        formatTransform({
          scale: interpolate(prev.scale, t.scale),
          translate: [
            interpolate(prev.translate[0], t.translate[0]),
            interpolate(prev.translate[1], t.translate[1]),
          ],
        })
      );
      break;
    }
    if (stage >= t.stage) {
      $("#map-transform-wrapper").attr("transform", formatTransform(t));
    }
  }

  if (stage <= 2) {
    $("#year-1").html(formatYear(2022));
  } else if (stage === 3) {
    $("#year-1").html(formatYear((frac * (1770 - 2022) + 2022).toFixed()));
  } else if (stage === 4) {
    $("#year-1").html(formatYear(1770));
  } else if (stages[stage + 1]?.year) {
    $("#year-1")
      .html(
        formatYear(
          stages
            .slice(0, stage + 1)
            .reverse()
            .find((s) => s.year)?.year ?? 1770
        )
      )
      .css(
        "transform",
        `scale(0.67) perspective(150px) translateZ(50px) rotateX(${
          frac / 2
        }turn`
      );
    $("#year-2")
      .html(formatYear(stages[stage + 1].year))
      .css(
        "transform",
        `scale(0.67) perspective(150px) translateZ(50px) rotateX(${
          frac / 2 - 0.5
        }turn`
      );
  }

  if (stage > mapTransforms[mapTransforms.length - 1].stage) {
    $("#map-transform-wrapper").attr(
      "transform",
      formatTransform(mapTransforms[mapTransforms.length - 1])
    );
  }

  if (stage < 17) {
    $("#map-roads").css("opacity", 0.3);
  } else if (stage === 19) {
    $("#map-roads").css("opacity", 0.3 * (1 - frac / 2));
  } else if (stage === 20) {
    $("#map-roads").css("opacity", 0.15);
  }

  if (stage === -1 && !isMobile) {
    $("#first-map").css("--fill", redToTan(frac));
    const stroke = colors.offwhite.clone();
    stroke.alpha = 1 - frac;
    $("#first-map").css("--stroke", stroke);
    $("#first-map").css("--stroke-width", (1 - frac) * 0.2);
  } else {
    $("#first-map").css("--fill", "var(--tan)");
    $("#first-map").css("--stroke", "transparent");
  }

  if (stage < 19) {
    $("#modern-maps").css("--fill", "var(--red)");
  } else if (stage === 19) {
    $("#modern-maps").css("--fill", redToTan(Math.min(frac * 2, 1)));
  } else {
    $("#modern-maps").css("--fill", "var(--tan)");
  }
};

onScroll();
setTimeout(onScroll, 200);
document.addEventListener("scroll", onScroll);
matchMedia("(min-width: 768px)").addEventListener("change", onScroll);
$("#to-top").click(function () {
  $("html, body").animate({ scrollTop: 0 }, 1000);
});

var slider = document.getElementById("slider");
var output = document.getElementById("slider-year");

slider.oninput = function () {
  output.innerHTML = formatYear(this.value);
  $(`#modern-maps .map`).css("opacity", 0);
  $(`#map-${this.value}`).css("opacity", 1);
};
