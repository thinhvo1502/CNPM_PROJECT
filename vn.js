!(function (b, a) {
  "object" == typeof exports && "undefined" != typeof module
    ? a(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], a)
    : a(
        ((b = "undefined" != typeof globalThis ? globalThis : b || self).vn =
          {})
      );
})(this, function (a) {
  "use strict";
  var b =
      "undefined" != typeof window && void 0 !== window.flatpickr
        ? window.flatpickr
        : {
            l10ns: {},
          },
    c = {
      weekdays: {
        shorthand: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
        longhand: [
          "Ch\u1EE7 nh\u1EADt",
          "Th\u1EE9 hai",
          "Th\u1EE9 ba",
          "Th\u1EE9 t\u01B0",
          "Th\u1EE9 n\u0103m",
          "Th\u1EE9 s\xe1u",
          "Th\u1EE9 b\u1EA3y",
        ],
      },
      months: {
        shorthand: [
          "Th1",
          "Th2",
          "Th3",
          "Th4",
          "Th5",
          "Th6",
          "Th7",
          "Th8",
          "Th9",
          "Th10",
          "Th11",
          "Th12",
        ],
        longhand: [
          "Th\xe1ng m\u1ED9t",
          "Th\xe1ng hai",
          "Th\xe1ng ba",
          "Th\xe1ng t\u01B0",
          "Th\xe1ng n\u0103m",
          "Th\xe1ng s\xe1u",
          "Th\xe1ng b\u1EA3y",
          "Th\xe1ng t\xe1m",
          "Th\xe1ng ch\xedn",
          "Th\xe1ng m\u01B0\u1EDDi",
          "Th\xe1ng m\u01B0\u1EDDi m\u1ED9t",
          "Th\xe1ng m\u01B0\u1EDDi hai",
        ],
      },
      firstDayOfWeek: 1,
      rangeSeparator: " \u0111\u1EBFn ",
    };
  b.l10ns.vn = c;
  var d = b.l10ns;
  (a.Vietnamese = c),
    (a.default = d),
    Object.defineProperty(a, "__esModule", {
      value: !0,
    });
});
