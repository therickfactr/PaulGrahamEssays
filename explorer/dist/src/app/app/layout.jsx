"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const google_1 = require("next/font/google");
require("./globals.css");
const inter = (0, google_1.Inter)({ subsets: ["latin"] });
exports.metadata = {
    title: "Paul Graham's Essays",
    description: "Created by @therickfactr",
};
function RootLayout({ children, }) {
    return (<html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>);
}
//# sourceMappingURL=layout.jsx.map