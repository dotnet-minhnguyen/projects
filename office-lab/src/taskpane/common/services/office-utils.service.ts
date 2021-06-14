import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import ContentControlCollection = Word.ContentControlCollection;

@Injectable()
export class OfficeUtilsService {

  private contentControls: ContentControlCollection;
  private ooxmlObject;

  constructor() {
    OfficeExtension.config.extendedErrorLogging = true;
  }

  loadContentControls() {
    const ccPromise = Word.run((context) => {
      this.contentControls = context.document.contentControls;
      context.load(this.contentControls);
      return context.sync()
    });
    return ccPromise;
  }

  findContentControlCollection(tagName, parentContent?) {
    const contentControls = parentContent || this.contentControls;
    return contentControls.getByTag(tagName);
  }

  insertText(tagName, content, location, parentContent?) {
    Word.run(async (context) => {
      const doc = context.document;
      await context.document.load();
      const foundContentControlCollection = this.findContentControlCollection(tagName, parentContent);
      await context.sync();
      await foundContentControlCollection.load('items');
      await foundContentControlCollection.context.sync();
      _.each(foundContentControlCollection.items, async (contentControl) => {
        contentControl.insertText(content, 'Replace');
        await foundContentControlCollection.load();
        await foundContentControlCollection.context.sync();
      });
      await context.document.load();
      await context.sync();
    });
  }

  duplicateContent(content, newTagName, afterContentControl, withBreak?) {
    return Word.run(async (context) => {
      const doc = context.document;
      await context.document.load();
      const foundContentControlCollection = this.findContentControlCollection(newTagName);
      await foundContentControlCollection.load('items');
      await foundContentControlCollection.context.sync();
      await context.sync();

      if (afterContentControl) {
        const foundContentControlCollection = this.findContentControlCollection(afterContentControl);
        await foundContentControlCollection.load('items');
        await foundContentControlCollection.context.sync();
        await context.sync();
        afterContentControl = foundContentControlCollection.items[foundContentControlCollection.items.length - 1];
      }
      if (!afterContentControl) {
        afterContentControl = foundContentControlCollection.items[foundContentControlCollection.items.length - 1];
      }
      if (!content) {
        content = foundContentControlCollection.items[foundContentControlCollection.items.length - 1];
      }

      const ooxmlObject = content.getOoxml();
      await content.context.sync();
      content = ooxmlObject.value;
      await afterContentControl.context.sync();
      const range = afterContentControl.getRange();
      await range.load();
      await range.context.sync();
      const insertedRange = range.insertOoxml(content, 'After');
      await insertedRange.load();
      const newContentControl = insertedRange.insertContentControl();
      newContentControl.set({'tag': newTagName});
      newContentControl.set({'title': newTagName});
      await newContentControl.load();
      await context.sync();

      await insertedRange.context.sync();
      await foundContentControlCollection.load();
      await foundContentControlCollection.context.sync();
      await context.document.load();
      return context.sync();
    });
  }

  insertFileFragment(tagName, ooxml) {
    return Word.run(async (context) => {
      this.contentControls = context.document.contentControls;
      context.load(this.contentControls);
      context.sync()

      const foundContentControlCollection = this.contentControls.getByTag(tagName);
      await context.sync();
      await foundContentControlCollection.load('items');
      await foundContentControlCollection.context.sync();
      console.log('test0')
      if (foundContentControlCollection.items && foundContentControlCollection.items[0]) {
        await foundContentControlCollection.items[0].load();
        await foundContentControlCollection.items[0].context.sync();
        foundContentControlCollection.items[0].insertFileFromBase64(ooxml, 'Replace');
        await foundContentControlCollection.load();
        await foundContentControlCollection.context.sync();
        await foundContentControlCollection.items[0].load();
        await foundContentControlCollection.items[0].context.sync();
        console.log('test2', foundContentControlCollection.items[0])
      }
      return context.sync();
    });
  }

  // helper method
  getOoxml(tagName) {
    return Word.run(async (context) => {
      this.contentControls = context.document.contentControls;
      context.load(this.contentControls);
      context.sync()
      const foundContentControlCollection = this.contentControls.getByTag(tagName);
      await context.sync();
      await foundContentControlCollection.load('items');
      await foundContentControlCollection.context.sync();
      let ooxml = null;
      if (foundContentControlCollection.items && foundContentControlCollection.items[0]) {
        await context.sync();
        ooxml = foundContentControlCollection.items[0].getOoxml();
        await foundContentControlCollection.items[0].load('value');
        await foundContentControlCollection.items[0].context.sync();
        console.log('tagName ooxml', ooxml)
      }
      await context.document.load();
      await context.sync();
      return ooxml.value;
    });
  }

  replaceText(tagName, content, parentContent?) {
    const location = 'Replace';
    return this.insertText(tagName, content || ' ', location, parentContent);
  }

  getContentControls() {
    return this.contentControls;
  }
}