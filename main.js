import m from "mithril";
import tagl from "tagl-mithril";

const { div, input, button, select, option } = tagl(m);

const range = (N) => Array.from({ length: N }, (_, i) => i);
const state = {
  field: [],
  N: 29,
  M: 29,
  color: "#000000",
  modelName: "",
  savedModels: JSON.parse(localStorage.getItem("models")) || [],
};

const newField = () => (state.field = range(state.N * state.M).map(() => null));

const setColor = (index) => {
  const box = document.querySelectorAll(".box")[index];
  const color = state.field[index] === state.color ? null : state.color;
  state.field[index] = color;
  box.style.setProperty("--color", color || "transparent");
};

const saveModel = () => {
  if (!state.modelName) {
    alert("Bitte einen Modellnamen eingeben.");
    return;
  }
  const newModel = {
    name: state.modelName,
    field: state.field,
    N: state.N,
    M: state.M,
  };
  state.savedModels.push(newModel);
  localStorage.setItem("models", JSON.stringify(state.savedModels));
  alert(`Modell "${state.modelName}" gespeichert!`);
};

const loadModel = (name) => {
  const model = state.savedModels.find((m) => m.name === name);
  if (model) {
    state.N = model.N;
    state.M = model.M;
    state.field = model.field;
    state.modelName = model.name;
  }
};

m.mount(document.body, {
  view: () =>
    div.container(
      state.field.length === 0
        ? [
            input({
              type: "number",
              value: state.N,
              oninput: (e) => (state.N = e.target.value),
            }),
            input({
              type: "number",
              value: state.M,
              oninput: (e) => (state.M = e.target.value),
            }),
            button({ onclick: newField }, "New"),
          ]
        : [
            input({
              type: "color",
              value: state.color,
              oninput: (e) => (state.color = e.target.value),
            }),
            input({
              type: "text",
              placeholder: "Modellname",
              value: state.modelName,
              oninput: (e) => (state.modelName = e.target.value),
            }),
            button({ onclick: saveModel }, "Save"),
            select(
              {
                onchange: (e) => loadModel(e.target.value),
              },
              [
                option({ value: "", disabled: true, selected: true }, "Laden"),
                ...state.savedModels.map((model) =>
                  option({ value: model.name }, model.name)
                ),
              ]
            ),
            div.field(
              { style: `--size-n:${state.N};--size-m:${state.M}` },
              state.field.map((color, i) =>
                div.box({
                  style: color ? `background-color: ${color};` : "",
                  onclick: () => setColor(i),
                })
              )
            ),
          ]
    ),
});
