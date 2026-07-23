export default defineContentScript({
  matches: ["https://playentry.org/*"],
  main() {
    console.log("Hello content.");
  },
});
