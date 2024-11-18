package server

import (
	"bufio"
	"encoding/json"
	"encoding/xml"
	"net/http"
	"os"
)

func (s *Server) RegisterRoutes() http.Handler {

	mux := http.NewServeMux()
	mux.HandleFunc("GET /doc-ids", s.GetDocIds)
	mux.HandleFunc("GET /docs/{id}", s.GetDocument)

	return mux
}

func (s *Server) GetDocIds(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	files, err := os.ReadDir("./internal/sample-xml")
	if err != nil {
		panic(err)
	}
	docMap := map[string]string{}
	type Document struct {
		XMLName   xml.Name `xml:"ClinicalDocument"`
		FirstName string   `xml:"recordTarget>patientRole>patient>name>given"`
		LastName  string   `xml:"recordTarget>patientRole>patient>name>family"`
	}
	for _, file := range files {
		doc := Document{}
		fileStream, err := os.Open("./internal/sample-xml/" + file.Name())
		defer fileStream.Close()
		stat, err := fileStream.Stat()
		if err != nil {
			panic(err)
		}
		bs := make([]byte, stat.Size())
		_, err = bufio.NewReader(fileStream).Read(bs)
		err = xml.Unmarshal(bs, &doc)
		if err != nil {
			panic(err)
		}
		docMap[file.Name()] = doc.FirstName + " " + doc.LastName
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(docMap)
}

func (s *Server) GetDocument(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	docId := r.PathValue("id")
	file, err := os.ReadFile("./internal/sample-xml/" + docId)
	if err != nil {
		panic(err)
	}
	w.Header().Set("Content-Type", "application/xml")
	w.Write(file)
}
