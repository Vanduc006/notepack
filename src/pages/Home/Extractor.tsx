// import React from 'react'

const Extractor: Record<string, (b: any) => string> = {
    // --- Headings ---
    heading_1: (b) => b.heading_1.rich_text.map((t: any) => t.plain_text).join(" "),
    heading_2: (b) => b.heading_2.rich_text.map((t: any) => t.plain_text).join(" "),
    heading_3: (b) => b.heading_3.rich_text.map((t: any) => t.plain_text).join(" "),

    // --- Text blocks ---
    paragraph: (b) => b.paragraph.rich_text.map((t: any) => t.plain_text).join(" "),
    quote: (b) => b.quote.rich_text.map((t: any) => t.plain_text).join(" "),
    callout: (b) => b.callout.rich_text.map((t: any) => t.plain_text).join(" "),

    // --- Lists ---
    bulleted_list_item: (b) => b.bulleted_list_item.rich_text.map((t: any) => t.plain_text).join(" "),
    numbered_list_item: (b) => b.numbered_list_item.rich_text.map((t: any) => t.plain_text).join(" "),
    to_do: (b) => b.to_do.rich_text.map((t: any) => t.plain_text).join(" "),

    // --- Media ---
    image: (b) => b.image.type === "external" ? b.image.external.url : b.image.file.url,
    video: (b) => b.video.type === "external" ? b.video.external.url : b.video.file.url,
    file: (b) => b.file.type === "external" ? b.file.external.url : b.file.file.url,
    pdf: (b) => b.pdf.type === "external" ? b.pdf.external.url : b.pdf.file.url,
    audio: (b) => b.audio.type === "external" ? b.audio.external.url : b.audio.file.url,

    // --- Embeds & Links ---
    bookmark: (b) => b.bookmark.url,
    embed: (b) => b.embed.url,
    link_preview: (b) => b.link_preview.url,
    link_to_page: (b) => b.link_to_page.page_id ?? b.link_to_page.database_id,
    synced_block: (b) => b.synced_block.synced_from, // có thể fetch thêm children

    // --- Code / Math ---
    code: (b) => b.code.rich_text.map((t: any) => t.plain_text).join(" "),
    equation: (b) => b.equation.expression,

    // --- Divider / Table ---
    divider: () => "----",
    table_row: (b) => b.table_row.cells.map((cell: any[]) =>
        cell.map((t: any) => t.plain_text).join(" ")
    ).join(" | "),

}

export default Extractor