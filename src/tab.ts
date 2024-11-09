import IssueTrackerSync from "../main";
import { App, Setting } from "obsidian";

export class Tab {
  contentEl: HTMLDivElement;
  headingEl: HTMLElement;
  navButton: HTMLDivElement;

  constructor(
    navEl: HTMLElement,
    settingsEl: HTMLElement,
    public name: string,
    protected plugin: IssueTrackerSync,
    private index: number,
    private app: App,
  ) {
    this.plugin = plugin;
    this.index = index;
    this.navButton = navEl.createDiv("its-navigation-item");
    this.navButton.createSpan().setText(name);

    this.contentEl = settingsEl.createDiv("its-tab-settings");
    const id = `ITS ${name}`;
    this.contentEl.id = id.toLowerCase().replaceAll(" ", "-");

    this.headingEl = new Setting(this.contentEl)
      .setName(name)
      .setHeading().nameEl;
    this.headingEl.addClass("its-hidden");
    this.display();
  }

  display(): void {
    const { contentEl, plugin, index } = this;
    new Setting(contentEl)
      .setName("Target Folder (optional)")
      .setDesc(
        "The relative path to the parent folder to sync from issue tracker",
      )
      .addText((text) => {
        text
          .setPlaceholder("Enter target folder")
          .setValue(plugin.settings.trackers[index].targetFolder)
          .onChange(async (value) => {
            plugin.settings.trackers[index].targetFolder = value;
            await plugin.saveSettings();
          });
      });
  }
}
