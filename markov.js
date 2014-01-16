var markov_map = {};
lookback = 2;

for (var i = 0; i < titles.length; i++) {
    var title = titles[i].split(' ');
    if (title.length > lookback) {
        for (var j = 0; j < title.length+1; j++) {
            var last_phrase = title.slice(Math.max(0, j-lookback), j).join(' ');
            var next_phrase = title.slice(j,j+1).join(' ');
            var map = markov_map[last_phrase] || {};
            var count = map[next_phrase] || 0;
            map[next_phrase] = count + 1;
            markov_map[last_phrase] = map;
        }
    }
}

function sum_values(obj) {
    var total = 0;

    for (var property in obj) {
        total += obj[property];
    }
    return total;
}

for (var word in markov_map) {
    var following = markov_map[word];
    var total = sum_values(following);

    for (var key in following) {
        following[key] /= total;
    }
}

function sample(items) {
    var next_word;
    var t = 0;

    for (var k in items) {
        v = items[k];
        t += v;

        if (t !== 0 && Math.random() < v/t) {
            next_word = k;
        }
    }

    return next_word;
}

function generate(n) {
    var sentences = [];

    while(sentences.length < n) {
        var sentence = [];
        var next_word = sample(markov_map['']);

        while(next_word !== '') {
            sentence.push(next_word);
            var tail = sentence.slice(-lookback).join(' ');
            next_word = sample(markov_map[tail]);
        }

        sentence = sentence.join(' ');
        
        var flag = true;
        for(var i=0; i < titles.length; i++) {
            if (titles[i].indexOf(sentence) != -1) {
                flag = false;
                break;
            }
        }

        if(flag) {
            sentences.push(sentence);
        }
    }

    var outputDiv = document.getElementById("output");
    var innerHTML = outputDiv.innerHTML;
    outputDiv.innerHTML = innerHTML + "<br/><br/>" + sentences.join("<br/>");
    outputDiv.scrollTop = outputDiv.scrollHeight;
}