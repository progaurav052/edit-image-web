const choose = document.querySelector("#choose"),
  img_input = document.querySelector(".img-input"),
  previewImg = document.querySelector(".preview-image img"),
  reset = document.querySelector("#reset"),
  save = document.querySelector("#save"),
  filterBtn = document.querySelectorAll(".filter button"),
  filterName = document.querySelector(".filter-value .name"),
  filterValue = document.querySelector(".filter-value .value"),
  filterSlider = document.querySelector(".slider input"),
  rotateBtn = document.querySelectorAll(".rotate button"),
  width=document.querySelector('#width'),
  height=document.querySelector('#height'),
  aspectRatio=document.querySelector("#ratio");
let brightness = "100",
  saturation = "100",
  inversion = "0",
  grayscale = "0",
  blurr="0",
  hue="180",
  rotate = 0,
  horizontal = 1,
  vertical = 1,
  actualRatio;
const loadImg = () => {
  let img = img_input.files[0];
  if (!img) {
    return 0;
  }
  previewImg.src = URL.createObjectURL(img);
  previewImg.addEventListener("load", () => {
    width.value=previewImg.naturalWidth;
    height.value=previewImg.naturalHeight;
    actualRatio=previewImg.naturalWidth/previewImg.naturalHeight;
    reset.click();
  });
};

filterBtn.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    option.classList.add("active");
    console.log(option);
    filterName.innerText = option.id;
    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else if (option.id=="grayscale"){
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
    else if(option.id=="blur"){
      filterSlider.max = "10";
      filterSlider.value = blurr;
      filterValue.innerText = `${blurr}%`;
    }
    else if(option.id=="hue-rotate"){
      filterSlider.max = "360";
      filterSlider.value = hue;
      filterValue.innerText = `${hue}%`;
    }
  });
});

const applyFilter = () => {
  console.log(rotate);
  previewImg.style.transform = `rotate(${rotate}deg) scale(${horizontal},${vertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) grayscale(${grayscale}%) invert(${inversion}%) blur(${blurr}px) hue-rotate(${hue}deg)`;
};

width.addEventListener("keyup",()=>{
  height.value = Math.floor(aspectRatio.checked ? width.value / actualRatio : height.value);
})
height.addEventListener("keyup", () => {
  width.value = Math.floor(aspectRatio.checked ? height.value * actualRatio : width.value);
});


rotateBtn.forEach((option) => {
  option.addEventListener("click", () => {
    console.log(option.id);
    if (option.id == "clockwise") {
      rotate = rotate - 90;
    } else if (option.id == "anti") {
      rotate = rotate + 90;
    } else if (option.id == "horizontal") {
      horizontal = horizontal === 1 ? -1 : 1;
    } else {
      vertical = vertical === 1 ? -1 : 1;
    }
    applyFilter();
  });
});

const putFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const filterType = document.querySelector(".filter .active");
  console.log(filterType.id);
  if (filterType.id === "brightness") {
    brightness = filterSlider.value;
  } else if (filterType.id === "inversion") {
    inversion = filterSlider.value;
  } else if (filterType.id === "saturation") {
    saturation = filterSlider.value;
  } else if (filterType.id === "grayscale") {
    grayscale = filterSlider.value;
  } else if (filterType.id === "blur") {
    blurr = filterSlider.value;
  } else if(filterType.id ==="hue-rotate"){
    hue = filterSlider.value;
  }
  applyFilter();
};

const resetFilter = () => {
  (brightness = "100"),
    (saturation = "100"),
    (inversion = "0"),
    (grayscale = "0"),
    (blurr="0"),
    (hue="0"),
  (rotate = 0), (horizontal = 1), (vertical = 1);
  filterBtn[0].click();
  width.value = previewImg.naturalWidth;
  height.value = previewImg.naturalHeight;
  actualRatio = previewImg.naturalWidth / previewImg.naturalHeight;
  applyFilter();
};

const saveImg = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const rotatedWidth =
    Math.abs(Math.cos((rotate * Math.PI) / 180)) * width.value +
    Math.abs(Math.sin((rotate * Math.PI) / 180)) * height.value;
  const rotatedHeight =
    Math.abs(Math.sin((rotate * Math.PI) / 180)) * width.value +
    Math.abs(Math.cos((rotate * Math.PI) / 180)) * height.value;
  canvas.width = rotatedWidth;
  canvas.height = rotatedHeight;
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) grayscale(${grayscale}%) invert(${inversion}%) blur(${blurr}px) hue-rotate(${hue}deg)`;

  ctx.translate(rotatedWidth / 2, rotatedHeight / 2);

  ctx.rotate((rotate * Math.PI) / 180);
  
  ctx.scale(horizontal, vertical);


  ctx.drawImage(
    previewImg,
    -width.value / 2,
    -height.value / 2,
    width.value,
    height.value
  );

  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL();
  link.click();
};

img_input.addEventListener("change", loadImg);
choose.addEventListener("click", () => img_input.click());
save.addEventListener("click", saveImg);
filterSlider.addEventListener("input", putFilter);
reset.addEventListener("click", resetFilter);
