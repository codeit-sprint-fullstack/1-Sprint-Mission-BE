export function createProduct (name, description, price, manufacturer = "", tag, image) {
    this.name = name;
    this.description = description;
    this.price = Number(price);
    this.manufacturer = manufacturer;
    this.tags = tag.split('@');
    this.images = image.split(',');
}

export function createArticleBody (title, content, img) {
    this.title = title;
    this.content = content;
    this.image = img;
}