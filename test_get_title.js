const content = `### [Scene 5: The Alignment of Outcasts]\n\nShe shoved the drive into Ian's hand.`;

function getSceneTitle(text) {
    let firstLine = text.split('\n')[0].trim();
    console.log('1:', firstLine);
    
    firstLine = firstLine.replace(/^#+\s*/, '').trim();
    console.log('2:', firstLine);
    
    firstLine = firstLine.replace(/^\[(.*?)\]$/, '$1').trim();
    console.log('3:', firstLine);
    
    const sentenceMatch = firstLine.match(/^.*?[.?!](?:\s|$)/);
    let title = firstLine;
    
    if (title.length > 50 && sentenceMatch) {
       title = sentenceMatch[0].trim();
    }
    
    if (title.length > 40) {
      title = title.substring(0, 40) + '...';
    }
    
    return title;
}

console.log('Final:', getSceneTitle(content));
