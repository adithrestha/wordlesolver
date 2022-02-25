
class Word:
    def __init__(self, word):
        self.word = word.strip().upper()
        self.unique_letters = len(set(word))
        self.length = len(word)
    
    def __lt__(self, other):
        return self.unique_letters < other.unique_letters

def load_words_file(filename):
    input_file = open(filename)
    return input_file.readlines()

def get_dictionary(filename='english_words_full.txt'):
    words = load_words_file(filename)
    words_array = [ Word(word) for word in words ]
    words_array.sort(reverse=True)
    words_by_length = { }
    for word_obj in words_array:
        n = len(word_obj.word)
        if n not in words_by_length:
            words_by_length[ n ] = [ word_obj.word ]
        else:
            words_by_length[n].append(word_obj.word)
    return words_by_length

def filtering(words_list, user_words, word_length):

    filtered_list = words_list

    for word_obj in user_words:
        word = word_obj[0]
        pattern = word_obj[1]
        for i in range(word_length):
            if pattern[i]=='-':
                filtered_list = [ w for w in filtered_list if word[i] not in w  ]
            elif pattern[i] == '?':
                filtered_list = [ w for w in filtered_list if word[i] in w and w[i]!=word[i]  ]
            else:
                filtered_list = [ w for w in filtered_list if w[i]==word[i]  ]

    return filtered_list


def get_suggestion(dictionary, user_words, word_length, suggestion_list_size=10):
    words_list = dictionary[word_length]
    return filtering(words_list, user_words, word_length)[:suggestion_list_size]
